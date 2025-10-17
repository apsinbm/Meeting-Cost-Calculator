import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AppText, Card, Button, AttendeePickerModal } from '../../components';
import { Colors, Spacing } from '../../constants';
import { scaledFontSize, scaledSpacing, scaledImageDimensions } from '../../utils/iPadOptimization';
import CalendarService from '../../services/CalendarService';
import EmployeeService from '../../services/EmployeeService';
import MeetingCostCalculator from '../../services/MeetingCostCalculator';
import EmployeeCostCalculator from '../../services/EmployeeCostCalculator';

/**
 * Today Screen
 * Shows today's calendar meetings with pre-calculated costs
 */
const TodayScreen = ({ navigation }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [manualAttendees, setManualAttendees] = useState({}); // keyed by meeting id
  const [selectedDate, setSelectedDate] = useState(new Date());
  const shouldReopenModalRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      loadEmployees();
      loadMeetings();

      // If modal should be reopened (employee was added), do so
      if (shouldReopenModalRef.current) {
        shouldReopenModalRef.current = false;
        setTimeout(() => setModalVisible(true), 100);
      }
    }, [selectedDate])
  );

  const loadEmployees = async () => {
    try {
      const allEmployees = await EmployeeService.getEmployees();
      setEmployees(allEmployees);
    } catch (error) {
      console.error('Error loading employees:', error);
      Alert.alert('Error', 'Failed to load employees. Please try again.');
    }
  };

  const loadMeetings = async (updatedManualAttendees = null) => {
    try {
      setLoading(true);

      // Check calendar permission
      const hasCalendarAccess = await CalendarService.checkPermissions();

      if (!hasCalendarAccess) {
        setHasPermission(false);
        setLoading(false);
        return;
      }

      setHasPermission(true);

      // Get meetings for selected date
      const todayMeetings = await CalendarService.getEventsForDate(selectedDate);
      const meetingsWithAttendees = [];
      for (const event of todayMeetings) {
        const meeting = await CalendarService.convertEventToMeeting(event);
        meetingsWithAttendees.push(meeting);
      }

      // Sort by start time
      meetingsWithAttendees.sort((a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart));

      // Use provided attendees or fall back to state
      const attendeesMap = updatedManualAttendees || manualAttendees;

      // Calculate pre-meeting costs
      const meetingsWithCosts = [];
      for (const meeting of meetingsWithAttendees) {
        const meetingId = meeting.calendarEventId;
        const matchedAttendees = meeting.attendees.matched || [];

        // Use manually selected attendees if available, otherwise use matched attendees
        const attendeesToUse = attendeesMap[meetingId] || matchedAttendees;

        if (attendeesToUse.length > 0) {
          const costData = MeetingCostCalculator.calculatePreMeetingCost(
            attendeesToUse,
            meeting.durationMinutes
          );

          meetingsWithCosts.push({
            ...meeting,
            costData,
          });
        } else {
          meetingsWithCosts.push(meeting);
        }
      }

      setMeetings(meetingsWithCosts);
    } catch (error) {
      console.error('Error loading meetings:', error);
      Alert.alert(
        'Calendar Error',
        'Unable to load calendar meetings. Please check your calendar permissions.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadMeetings();
  };

  const handleRequestPermission = async () => {
    const granted = await CalendarService.requestPermissions();
    if (granted) {
      loadMeetings();
    }
  };

  const handleSelectAttendees = (meeting) => {
    setSelectedMeeting(meeting);
    setModalVisible(true);
  };

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleConfirmAttendees = (selectedEmployees) => {
    if (selectedMeeting) {
      // Selecting attendees for existing calendar meeting
      const meetingId = selectedMeeting.calendarEventId;
      const updatedAttendees = {
        ...manualAttendees,
        [meetingId]: selectedEmployees,
      };

      setManualAttendees(updatedAttendees);

      // Reload meetings with updated attendees to recalculate costs immediately
      loadMeetings(updatedAttendees);
      setModalVisible(false);
      setSelectedMeeting(null);
    }
  };

  const handleStartMeeting = (meeting) => {
    const meetingId = meeting.calendarEventId;
    const matchedAttendees = meeting.attendees.matched || [];
    const attendeesToUse = manualAttendees[meetingId] || matchedAttendees;

    if (attendeesToUse.length === 0) {
      Alert.alert(
        'No Employees',
        'Select attendees to track meeting costs.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Select Attendees', onPress: () => handleSelectAttendees(meeting) },
        ]
      );
      return;
    }

    navigation.navigate('ActiveMeeting', {
      meeting,
      attendees: attendeesToUse,
    });
  };

  const renderMeeting = ({ item }) => {
    const isNow = CalendarService.isMeetingNow(item);
    const isPast = CalendarService.isMeetingPast(item);
    const meetingId = item.calendarEventId;
    const matchedCount = item.attendees.matched?.length || 0;
    const unmatchedCount = item.attendees.unmatched?.length || 0;
    const manuallySelected = manualAttendees[meetingId] || null;
    const manualCount = manuallySelected?.length || 0;
    const hasEmployees = employees.length > 0;

    const startDate = new Date(item.scheduledStart);
    const endDate = new Date(item.scheduledEnd);
    const timeRange = `${startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

    return (
      <Card
        borderColor={isNow ? Colors.inProgress : undefined}
        style={[styles.meetingCard, isPast && styles.pastMeetingCard]}
      >
        {/* Time and Duration */}
        <View style={styles.meetingHeader}>
          <AppText variant="bodySmall" color={Colors.textSecondary}>
            {timeRange}
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            {item.durationMinutes} min
          </AppText>
        </View>

        {/* Title */}
        <AppText variant="h3" style={styles.meetingTitle}>
          {item.title}
        </AppText>

        {/* Attendees */}
        <View style={styles.attendeesRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="bodySmall" color={Colors.textSecondary}>
              {manuallySelected ? (
                `${manualCount} manually selected`
              ) : (
                <>
                  {matchedCount > 0 && `${matchedCount} employee${matchedCount !== 1 ? 's' : ''}`}
                  {matchedCount > 0 && unmatchedCount > 0 && ', '}
                  {unmatchedCount > 0 && `${unmatchedCount} other${unmatchedCount !== 1 ? 's' : ''}`}
                  {matchedCount === 0 && unmatchedCount === 0 && 'No attendees'}
                </>
              )}
            </AppText>
          </View>
          {hasEmployees && !isPast && (
            <Button
              title={manuallySelected ? 'Change' : 'Select'}
              variant="secondary"
              onPress={() => handleSelectAttendees(item)}
              style={{ paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs }}
            />
          )}
        </View>

        {/* Cost */}
        {item.costData && (
          <View style={styles.costSection}>
            <AppText variant="bodySmall" color={Colors.textSecondary}>
              Pre-calculated cost
            </AppText>
            <AppText variant="h2" color={Colors.primary}>
              {EmployeeCostCalculator.formatCurrency(item.costData.totalCost)}
            </AppText>

            {/* Milestone costs */}
            <View style={styles.milestonesRow}>
              {item.costData.milestones.slice(1, 5).map((milestone) => (
                <View key={milestone.timeMinutes} style={styles.milestoneChip}>
                  <AppText variant="caption" color={Colors.textSecondary}>
                    {milestone.timeMinutes} min: ${milestone.cost.toFixed(0)}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Button */}
        {isNow && !isPast && (manualCount > 0 || matchedCount > 0) && (
          <Button
            title="Start Meeting"
            onPress={() => handleStartMeeting(item)}
            style={{ marginTop: Spacing.md }}
          />
        )}

        {!hasEmployees && (
          <AppText variant="caption" color={Colors.warning} style={{ marginTop: Spacing.sm }}>
            Add employees to calculate cost
          </AppText>
        )}
      </Card>
    );
  };

  const selectedDateStr = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const totalCost = meetings.reduce((sum, m) => sum + (m.costData?.totalCost || 0), 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Attendee Picker Modal */}
      <AttendeePickerModal
        visible={modalVisible}
        employees={employees}
        selectedEmployees={
          selectedMeeting ? (manualAttendees[selectedMeeting.calendarEventId] || selectedMeeting.attendees.matched || []) : []
        }
        onConfirm={handleConfirmAttendees}
        onCancel={() => {
          setModalVisible(false);
          setSelectedMeeting(null);
        }}
        onAddEmployee={() => {
          setModalVisible(false);
          shouldReopenModalRef.current = true;
          navigation.navigate('AddEmployee', { isFromTodayScreen: true });
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dateNavigation}>
          <TouchableOpacity onPress={handlePrevDay} style={styles.navButton}>
            <AppText variant="h3" color={Colors.primary}>‹</AppText>
          </TouchableOpacity>
          <View style={styles.dateContainer}>
            <AppText variant="h2">{selectedDateStr}</AppText>
            {!isToday && (
              <TouchableOpacity onPress={handleToday}>
                <AppText variant="caption" color={Colors.primary} style={{ marginTop: 4 }}>
                  Go to Today
                </AppText>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={handleNextDay} style={styles.navButton}>
            <AppText variant="h3" color={Colors.primary}>›</AppText>
          </TouchableOpacity>
        </View>
        {meetings.length > 0 && (
          <AppText variant="bodySmall" color={Colors.textSecondary}>
            {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} • {EmployeeCostCalculator.formatCurrency(totalCost)} total
          </AppText>
        )}
      </View>

      {/* Content */}
      {!hasPermission ? (
        <View style={styles.permissionContainer}>
          <View style={styles.emptyIconContainer}>
            <Image
              source={require('../../../assets/Cal.png')}
              style={styles.emptyIconImage}
              resizeMode="contain"
            />
          </View>
          <AppText variant="h3" style={styles.permissionTitle}>
            Calendar Access
          </AppText>
          <AppText variant="body" color={Colors.textSecondary} style={styles.permissionText}>
            Grant calendar and reminders access to see scheduled meetings and pre-calculate costs.
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: Spacing.sm, textAlign: 'center', fontStyle: 'italic' }}>
            Note: iOS requires both Calendar and Reminders permissions
          </AppText>
          <AppText variant="body" color={Colors.textSecondary} style={styles.emptyQuote}>
            "The most efficient meeting is the one that never happened."
          </AppText>
          <View style={{ width: '100%', marginTop: Spacing.lg }}>
            <Button
              title="Continue"
              onPress={handleRequestPermission}
            />
          </View>
          <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: Spacing.md, textAlign: 'center' }}>
            Your data never leaves this device
          </AppText>
        </View>
      ) : (
        <>
          {meetings.length > 0 && (
            <View style={styles.calendarHeaderContainer}>
              <AppText variant="h3" style={styles.calendarHeaderTitle}>
                Meetings in Calendar Today
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.calendarHeaderSubtitle}>
                Add calendar attendees to your employee database to calculate costs
              </AppText>
            </View>
          )}
          <FlatList
            data={meetings}
            renderItem={renderMeeting}
            keyExtractor={(item, index) => item.calendarEventId || index.toString()}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            ListEmptyComponent={
              !loading && (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconContainer}>
                    <Image
                      source={require('../../../assets/Cal.png')}
                      style={styles.emptyIconImage}
                      resizeMode="contain"
                    />
                  </View>
                  <AppText variant="h3" style={styles.emptyTitle}>
                    No Meetings Scheduled in Calendar Today
                  </AppText>
                  <AppText variant="body" color={Colors.textSecondary} style={styles.emptyQuote}>
                    "Keep meetings as small as possible (under 10 people) and as short as possible, include only those who can directly contribute or decide, and empower people to leave if they're not adding value. Large meetings kill productivity and accountability and add costs."
                  </AppText>
                </View>
              )
            }
          />
        </>
      )}
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
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  navButton: {
    padding: Spacing.sm,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  calendarHeaderContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  calendarHeaderTitle: {
    marginBottom: Spacing.xs,
  },
  calendarHeaderSubtitle: {
    lineHeight: 18,
  },
  list: {
    paddingBottom: Spacing.lg,
  },
  meetingCard: {
    marginTop: Spacing.sm,
  },
  pastMeetingCard: {
    opacity: 0.5,
  },
  meetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  meetingTitle: {
    marginBottom: Spacing.sm,
  },
  attendeesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  costSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  milestonesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
  },
  milestoneChip: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    marginRight: Spacing.xs,
    marginTop: Spacing.xs,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scaledSpacing(Spacing.xl),
  },
  permissionTitle: {
    marginBottom: scaledSpacing(Spacing.sm),
    textAlign: 'center',
    fontSize: scaledFontSize(20),
  },
  permissionText: {
    textAlign: 'center',
    fontSize: scaledFontSize(16),
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: scaledSpacing(Spacing.xl),
    paddingTop: scaledSpacing(Spacing.xxxl),
    paddingBottom: scaledSpacing(Spacing.xxxl),
  },
  emptyIconContainer: {
    ...scaledImageDimensions(180, 180),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaledSpacing(Spacing.lg),
  },
  emptyIconImage: {
    ...scaledImageDimensions(180, 180),
  },
  emptyIconText: {
    fontSize: 48,
  },
  emptyTitle: {
    marginBottom: scaledSpacing(Spacing.sm),
    textAlign: 'center',
    fontSize: scaledFontSize(20),
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: scaledSpacing(Spacing.lg),
    fontSize: scaledFontSize(16),
  },
  emptyQuote: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: scaledSpacing(Spacing.lg),
    paddingHorizontal: scaledSpacing(Spacing.md),
    fontSize: scaledFontSize(18),
    lineHeight: scaledFontSize(18) * 1.4,
  },
  emptyHint: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default TodayScreen;
