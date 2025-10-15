import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card } from '../../components';
import { Colors, Spacing, FontSizes } from '../../constants';
import MeetingCostCalculator from '../../services/MeetingCostCalculator';
import MeetingService from '../../services/MeetingService';
import EmployeeCostCalculator from '../../services/EmployeeCostCalculator';

/**
 * Active Meeting Screen
 * Real-time cost tracking with per-second updates and milestone detection
 */
const ActiveMeetingScreen = ({ route, navigation }) => {
  const { meeting: initialMeeting, attendees } = route.params;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const timerRef = useRef(null);
  const isPausedRef = useRef(false);
  const startTimeRef = useRef(Date.now());
  const pausedTimeRef = useRef(0); // Total accumulated paused time in milliseconds
  const pauseStartRef = useRef(null); // When current pause started

  useEffect(() => {
    startMeeting();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startMeeting = async () => {
    // Create meeting record
    const result = await MeetingService.startMeeting(
      {
        ...initialMeeting,
        title: initialMeeting.title || 'Meeting',
        scheduledStart: initialMeeting.scheduledStart,
        scheduledEnd: initialMeeting.scheduledEnd,
        durationMinutes: initialMeeting.durationMinutes,
      },
      attendees
    );

    if (result.success) {
      setMeetingData(result.meeting);
      startTimer();
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setElapsedSeconds((prev) => prev + 1);
      }
    }, 1000);
  };

  const handlePause = () => {
    if (isPausedRef.current) {
      // Resuming - accumulate the paused time
      if (pauseStartRef.current) {
        const pauseDuration = Date.now() - pauseStartRef.current;
        pausedTimeRef.current += pauseDuration;
        pauseStartRef.current = null;
      }
      isPausedRef.current = false;
      setIsPaused(false);
    } else {
      // Pausing - record when pause started
      pauseStartRef.current = Date.now();
      isPausedRef.current = true;
      setIsPaused(true);
    }
  };

  const handleEnd = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // If still paused when ending, add the current pause duration
    let totalPausedMs = pausedTimeRef.current;
    if (isPausedRef.current && pauseStartRef.current) {
      totalPausedMs += Date.now() - pauseStartRef.current;
    }

    if (meetingData) {
      const result = await MeetingService.endMeeting(meetingData.id, totalPausedMs);

      if (result.success) {
        setShowEndDialog(true);
      } else {
        Alert.alert('Error', 'Failed to save meeting data');
        navigation.navigate('Main', { screen: 'History' });
      }
    } else {
      navigation.navigate('Main', { screen: 'History' });
    }
  };

  const handleViewHistory = () => {
    setShowEndDialog(false);
    navigation.navigate('Main', {
      screen: 'History',
    });
  };

  const handleDone = () => {
    setShowEndDialog(false);
    navigation.navigate('Main', {
      screen: 'History',
    });
  };

  // Calculate real-time costs
  const elapsedMinutes = elapsedSeconds / 60;
  const realTimeCost = MeetingCostCalculator.calculateRealTimeCost(attendees, elapsedMinutes);

  // Calculate progress bar based on current milestone interval
  const milestones = [1, 15, 30, 45, 60, 90, 120];
  let progressPercent = 0;

  if (realTimeCost.nextMilestone) {
    // Find the previous milestone
    const nextMilestoneIndex = milestones.indexOf(realTimeCost.nextMilestone);
    const prevMilestone = nextMilestoneIndex > 0 ? milestones[nextMilestoneIndex - 1] : 0;
    const intervalDuration = realTimeCost.nextMilestone - prevMilestone;
    const progressInInterval = elapsedMinutes - prevMilestone;
    progressPercent = (progressInInterval / intervalDuration) * 100;
  }

  // Format elapsed time
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  const timeDisplay = hours > 0
    ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    : `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Meeting Title */}
        <AppText variant="h3" style={styles.title}>
          {initialMeeting.title || 'Meeting'}
        </AppText>

        {isPaused && (
          <View style={styles.pausedBanner}>
            <AppText variant="body" color={Colors.white}>
              Paused
            </AppText>
          </View>
        )}

        {/* Cost Display - HUGE */}
        <View style={styles.costContainer}>
          <AppText variant="bodySmall" color={Colors.textSecondary} style={styles.costLabel}>
            MEETING COST
          </AppText>
          <AppText variant="costDisplay" style={[styles.costDisplay, !isPaused && styles.costDisplayRising]}>
            ${realTimeCost.currentCost.toFixed(2)}
          </AppText>
          <AppText variant="body" color={Colors.textSecondary} style={styles.costSubtext}>
            {isPaused ? 'paused' : 'and counting...'}
          </AppText>
        </View>

        {/* Elapsed Time */}
        <View style={styles.timeContainer}>
          <AppText variant="h1" style={styles.timeDisplay}>
            {timeDisplay}
          </AppText>
          <AppText variant="body" color={Colors.textSecondary}>
            elapsed
          </AppText>
        </View>

        {/* Expanded Details - Collapsible */}
        <View style={styles.divider} />

        {/* Next Milestone */}
        {realTimeCost.nextMilestone && (
          <Card style={styles.milestoneCard}>
            <AppText variant="bodySmall" color={Colors.textSecondary}>
              Next milestone
            </AppText>
            <View style={styles.milestoneInfo}>
              <AppText variant="h3">
                Cost at {realTimeCost.nextMilestone} minutes:
              </AppText>
              <AppText variant="bodyLarge" color={Colors.primary}>
                ${realTimeCost.nextMilestoneCost?.toFixed(2)}
              </AppText>
            </View>
            <AppText variant="bodySmall" color={Colors.textSecondary}>
              in {realTimeCost.minutesToNextMilestone?.toFixed(1)} minutes
            </AppText>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(progressPercent, 100)}%`,
                  },
                ]}
              />
            </View>
          </Card>
        )}

        {/* Per-Attendee Costs */}
        <Card style={{ marginTop: Spacing.md }}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Cost Per Attendee
          </AppText>
          {realTimeCost.attendeeCosts.map((attendee, index) => (
            <View key={index} style={styles.attendeeRow}>
              <View style={styles.attendeeInfo}>
                <AppText variant="body">{attendee.name}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  {attendee.role}
                </AppText>
              </View>
              <AppText variant="bodyLarge" color={Colors.primary}>
                ${attendee.currentCost.toFixed(2)}
              </AppText>
            </View>
          ))}
        </Card>

        {/* Milestones Reached */}
        {realTimeCost.milestonesReached.length > 0 && (
          <Card style={{ marginTop: Spacing.md }}>
            <AppText variant="h3" style={styles.sectionTitle}>
              Milestones Reached
            </AppText>
            {realTimeCost.milestonesReached.map((milestone) => (
              <View key={milestone} style={styles.milestoneReachedRow}>
                <View style={styles.checkmark}>
                  <AppText variant="body" color={Colors.success}>
                    ✓
                  </AppText>
                </View>
                <AppText variant="body">{milestone} minutes</AppText>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <Button
          title={isPaused ? 'Resume' : 'Pause'}
          variant="secondary"
          onPress={handlePause}
          style={{ flex: 1, marginRight: Spacing.sm }}
        />
        <Button
          title="End Meeting"
          onPress={handleEnd}
          style={{ flex: 1 }}
        />
      </View>

      {/* End Meeting Dialog */}
      <Modal
        visible={showEndDialog}
        animationType="fade"
        transparent={false}
        onRequestClose={handleDone}
      >
        <View style={styles.endDialogContainer}>
          <View style={styles.endDialogContent}>
            <AppText variant="h2" style={styles.endDialogTitle}>
              Meeting Ended
            </AppText>

            <View style={styles.endDialogStats}>
              <View style={styles.endDialogStat}>
                <AppText variant="bodySmall" color={Colors.textSecondary}>
                  FINAL COST
                </AppText>
                <AppText variant="h1" color={Colors.primary} style={styles.endDialogCost}>
                  {EmployeeCostCalculator.formatCurrency(realTimeCost.currentCost)}
                </AppText>
              </View>

              <View style={styles.endDialogRow}>
                <View style={styles.endDialogStatSmall}>
                  <AppText variant="bodySmall" color={Colors.textSecondary}>
                    Duration
                  </AppText>
                  <AppText variant="h3">{timeDisplay}</AppText>
                </View>
                <View style={styles.endDialogStatSmall}>
                  <AppText variant="bodySmall" color={Colors.textSecondary}>
                    Attendees
                  </AppText>
                  <AppText variant="h3">{attendees.length}</AppText>
                </View>
              </View>
            </View>

            <View style={styles.endDialogButtons}>
              <Button
                title="View History"
                variant="secondary"
                onPress={handleViewHistory}
                style={styles.endDialogButton}
              />
              <Button
                title="Done"
                onPress={handleDone}
                style={styles.endDialogButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  pausedBanner: {
    backgroundColor: Colors.warning,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  costContainer: {
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  costLabel: {
    letterSpacing: 2,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  costDisplay: {
    color: Colors.primary,
    fontSize: 72,
    fontWeight: '700',
    lineHeight: 86,
    marginBottom: Spacing.xs,
  },
  costDisplayRising: {
    color: Colors.error,  // Red when cost is rising
  },
  costSubtext: {
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  timeContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: Spacing.lg,
  },
  timeDisplay: {
    fontSize: 56,
    fontWeight: '700',
    lineHeight: 68,
    marginBottom: Spacing.xs,
  },
  attendeesContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  attendeesLabel: {
    letterSpacing: 1.5,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  attendeeSimpleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xl,
  },
  milestoneCard: {
    backgroundColor: Colors.infoLight,
  },
  milestoneInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: 2,
    marginTop: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  attendeeAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  attendeeInfo: {
    flex: 1,
  },
  milestoneReachedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  endDialogContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  endDialogContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  endDialogTitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  endDialogStats: {
    marginBottom: Spacing.xl,
  },
  endDialogStat: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  endDialogCost: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 58,
    marginTop: Spacing.sm,
  },
  endDialogRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  endDialogStatSmall: {
    alignItems: 'center',
  },
  endDialogButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  endDialogButton: {
    flex: 1,
  },
});

export default ActiveMeetingScreen;
