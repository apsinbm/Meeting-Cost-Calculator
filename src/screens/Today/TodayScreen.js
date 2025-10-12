import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AppText, Card, Button, AttendeePickerModal } from '../../components';
import { Colors, Spacing } from '../../constants';
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
  const [isStartingManualMeeting, setIsStartingManualMeeting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadEmployees();
      loadMeetings();
    }, [])
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

      // Get today's meetings
      const todayMeetings = await CalendarService.getTodayMeetings();

      // Use provided attendees or fall back to state
      const attendeesMap = updatedManualAttendees || manualAttendees;

      // Calculate pre-meeting costs
      const meetingsWithCosts = [];
      for (const meeting of todayMeetings) {
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

  const handleStartManualMeeting = () => {
    if (employees.length === 0) {
      Alert.alert(
        'No Employees',
        'Add employees first to track meeting costs.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Employees', onPress: () => navigation.navigate('EmployeeList') },
        ]
      );
      return;
    }

    setIsStartingManualMeeting(true);
    setModalVisible(true);
  };

  const handleConfirmAttendees = (selectedEmployees) => {
    if (isStartingManualMeeting) {
      // Starting a new manual meeting
      const manualMeeting = {
        title: 'Ad-hoc Meeting',
        scheduledStart: new Date().toISOString(),
        isManual: true,
      };

      setModalVisible(false);
      setIsStartingManualMeeting(false);
      setSelectedMeeting(null);

      navigation.navigate('ActiveMeeting', {
        meeting: manualMeeting,
        attendees: selectedEmployees,
      });
    } else if (selectedMeeting) {
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
              {item.costData.milestones.slice(1, 4).map((milestone) => (
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
            title="Join Meeting"
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

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const totalCost = meetings.reduce((sum, m) => sum + (m.costData?.totalCost || 0), 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Attendee Picker Modal */}
      <AttendeePickerModal
        visible={modalVisible}
        employees={employees}
        selectedEmployees={
          isStartingManualMeeting
            ? []
            : (selectedMeeting ? (manualAttendees[selectedMeeting.calendarEventId] || selectedMeeting.attendees.matched || []) : [])
        }
        onConfirm={handleConfirmAttendees}
        onCancel={() => {
          setModalVisible(false);
          setSelectedMeeting(null);
          setIsStartingManualMeeting(false);
        }}
        onAddEmployee={() => {
          setModalVisible(false);
          navigation.navigate('AddEmployee', {
            onEmployeeAdded: () => {
              loadEmployees();
              // Reopen modal after adding employee
              setTimeout(() => setModalVisible(true), 100);
            },
          });
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <AppText variant="h2">{today}</AppText>
        {meetings.length > 0 && (
          <AppText variant="bodySmall" color={Colors.textSecondary}>
            {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} • {EmployeeCostCalculator.formatCurrency(totalCost)} total
          </AppText>
        )}
      </View>

      {/* Content */}
      {!hasPermission ? (
        <View style={styles.permissionContainer}>
          <View style={styles.emptyIcon} />
          <AppText variant="h3" style={styles.permissionTitle}>
            Calendar Access Required
          </AppText>
          <AppText variant="body" color={Colors.textSecondary} style={styles.permissionText}>
            We read your calendar to calculate meeting costs and match attendees to employee profiles.
          </AppText>
          <Button
            title="Grant Access"
            onPress={handleRequestPermission}
            style={{ marginTop: Spacing.lg }}
          />
          <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: Spacing.md, textAlign: 'center' }}>
            Your data never leaves this device
          </AppText>
        </View>
      ) : (
        <>
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
                  <View style={styles.emptyIcon} />
                  <AppText variant="h3" style={styles.emptyTitle}>
                    No meetings today
                  </AppText>
                  <AppText variant="body" color={Colors.textSecondary} style={styles.emptyText}>
                    Your calendar is clear
                  </AppText>
                  <AppText variant="bodySmall" color={Colors.textSecondary} style={styles.emptyHint}>
                    Use this time for focused work
                  </AppText>
                </View>
              )
            }
          />
          {/* Floating Start Button */}
          {employees.length > 0 && (
            <View style={styles.floatingButtonContainer}>
              <Button
                title="Start Meeting"
                onPress={handleStartManualMeeting}
              />
            </View>
          )}
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
  floatingButtonContainer: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    paddingHorizontal: Spacing.xl,
  },
  permissionTitle: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  permissionText: {
    textAlign: 'center',
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
    marginBottom: Spacing.xs,
  },
  emptyHint: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default TodayScreen;
