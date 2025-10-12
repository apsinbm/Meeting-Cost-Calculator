import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AppText, Card, Button } from '../../components';
import { Colors, Spacing } from '../../constants';
import MeetingService from '../../services/MeetingService';
import EmailService from '../../services/EmailService';
import EmployeeCostCalculator from '../../services/EmployeeCostCalculator';

/**
 * History Screen
 * Shows past meetings with filtering and analysis
 */
const HistoryScreen = () => {
  const [meetings, setMeetings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      setLoading(true);
      const completed = await MeetingService.getCompletedMeetings();
      setMeetings(completed);

      const summaryData = await MeetingService.getMeetingsSummary(completed);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const handleEmailReport = async () => {
    if (meetings.length === 0) return;

    const result = await EmailService.sendReport(meetings, 'All Time');
    if (!result.success) {
      console.error('Failed to send report:', result.error);
    }
  };

  const handleEditMeeting = (meeting) => {
    Alert.alert(
      'Edit Meeting',
      'Adjust attendees or duration',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Edit Duration',
          onPress: () => {
            Alert.prompt(
              'Edit Duration',
              `Current: ${meeting.actualMinutes} minutes`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Save',
                  onPress: async (newDuration) => {
                    const minutes = parseInt(newDuration);
                    if (minutes && minutes > 0) {
                      await MeetingService.updateMeeting(meeting.id, {
                        actualMinutes: minutes,
                        actualCost: (minutes / 60) * meeting.attendees.reduce((sum, att) => sum + att.perMinuteCost * 60, 0),
                      });
                      loadHistory();
                    }
                  },
                },
              ],
              'plain-text',
              meeting.actualMinutes.toString()
            );
          },
        },
      ]
    );
  };

  const handleDeleteMeeting = (meeting) => {
    Alert.alert(
      'Delete Meeting',
      `Are you sure you want to delete "${meeting.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await MeetingService.deleteMeeting(meeting.id);
            if (result.success) {
              loadHistory();
            } else {
              Alert.alert('Error', 'Failed to delete meeting');
            }
          },
        },
      ]
    );
  };

  const renderMeeting = ({ item }) => {
    const date = new Date(item.actualStart).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const time = new Date(item.actualStart).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    const ranOver = item.ranOver;
    const endedEarly = item.endedEarly;

    return (
      <Card style={styles.meetingCard}>
        <View style={styles.meetingHeader}>
          <View style={styles.meetingInfo}>
            <AppText variant="body" style={styles.meetingTitle}>
              {item.title}
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              {date} • {time}
            </AppText>
          </View>
          <View style={styles.meetingCost}>
            <AppText variant="h3" color={Colors.primary}>
              {EmployeeCostCalculator.formatCurrency(item.actualCost)}
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              {item.actualMinutes} min
            </AppText>
          </View>
        </View>

        {(ranOver || endedEarly) && (
          <View style={styles.statusRow}>
            {ranOver && (
              <View style={[styles.statusChip, styles.overrunChip]}>
                <AppText variant="caption" color={Colors.warning}>
                  Ran over +{item.minutesDifference} min
                </AppText>
              </View>
            )}
            {endedEarly && (
              <View style={[styles.statusChip, styles.earlyChip]}>
                <AppText variant="caption" color={Colors.success}>
                  Ended early -{Math.abs(item.minutesDifference)} min
                </AppText>
              </View>
            )}
          </View>
        )}

        <View style={styles.attendeesRow}>
          <AppText variant="caption" color={Colors.textSecondary}>
            {item.attendees?.length || 0} attendee{item.attendees?.length !== 1 ? 's' : ''}
          </AppText>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditMeeting(item)}
          >
            <AppText variant="bodySmall" color={Colors.primary}>
              Edit
            </AppText>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteMeeting(item)}
          >
            <AppText variant="bodySmall" color={Colors.error}>
              Delete
            </AppText>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="h2">History</AppText>
        {meetings.length > 0 && (
          <AppText variant="bodySmall" color={Colors.textSecondary}>
            {meetings.length} meeting{meetings.length !== 1 ? 's' : ''}
          </AppText>
        )}
      </View>

      {/* Summary Statistics */}
      {summary && summary.totalMeetings > 0 && (
        <View style={styles.summaryContainer}>
          <Card>
            <AppText variant="h3" style={styles.summaryTitle}>
              Summary
            </AppText>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <AppText variant="h2" color={Colors.primary}>
                  {EmployeeCostCalculator.formatCurrency(summary.totalCost)}
                </AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  Total Cost
                </AppText>
              </View>
              <View style={styles.summaryItem}>
                <AppText variant="h2">{summary.totalMeetings}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  Meetings
                </AppText>
              </View>
              <View style={styles.summaryItem}>
                <AppText variant="h2">{Math.round(summary.totalMinutes / 60)}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  Hours
                </AppText>
              </View>
              <View style={styles.summaryItem}>
                <AppText variant="h2">
                  {EmployeeCostCalculator.formatCurrency(summary.averageCost)}
                </AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  Avg/Meeting
                </AppText>
              </View>
            </View>

            {meetings.length > 0 && (
              <Button
                title="Email Report"
                variant="secondary"
                onPress={handleEmailReport}
                style={{ marginTop: Spacing.md }}
              />
            )}
          </Card>
        </View>
      )}

      {/* Meetings List */}
      <FlatList
        data={meetings}
        renderItem={renderMeeting}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon} />
              <AppText variant="h3" style={styles.emptyTitle}>
                No meeting history yet
              </AppText>
              <AppText variant="body" color={Colors.textSecondary} style={styles.emptyText}>
                Track your first meeting to see it here
              </AppText>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  summaryTitle: {
    marginBottom: Spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
  summaryItem: {
    width: '50%',
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.md,
  },
  list: {
    paddingBottom: Spacing.lg,
  },
  meetingCard: {
    marginTop: Spacing.sm,
  },
  meetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  meetingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  meetingTitle: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  meetingCost: {
    alignItems: 'flex-end',
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  statusChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    marginRight: Spacing.xs,
  },
  overrunChip: {
    backgroundColor: Colors.warningLight,
  },
  earlyChip: {
    backgroundColor: Colors.successLight,
  },
  attendeesRow: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginTop: Spacing.xs,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  actionDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.gray200,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});

export default HistoryScreen;
