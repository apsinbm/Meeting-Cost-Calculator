import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AppText, Card, Button } from '../../components';
import { Colors, Spacing } from '../../constants';
import MeetingService from '../../services/MeetingService';
import MeetingCostCalculator from '../../services/MeetingCostCalculator';
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
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [newDuration, setNewDuration] = useState('');

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
    setEditingMeeting(meeting);
    setNewDuration(meeting.actualMinutes.toString());
    setEditModalVisible(true);
  };

  const handleSaveEditedDuration = async () => {
    const minutes = parseInt(newDuration);
    if (!minutes || minutes <= 0) {
      Alert.alert('Invalid Duration', 'Please enter a valid number of minutes');
      return;
    }

    if (!editingMeeting) return;

    // Recalculate all derived fields using MeetingCostCalculator
    const scheduledMinutes = editingMeeting.durationMinutes || 0;
    const finalCosts = MeetingCostCalculator.calculateFinalCost(
      editingMeeting.attendees,
      minutes,
      scheduledMinutes
    );

    await MeetingService.updateMeeting(editingMeeting.id, {
      actualMinutes: minutes,
      actualCost: finalCosts.actualCost,
      costDifference: finalCosts.costDifference,
      ranOver: finalCosts.ranOver,
      endedEarly: finalCosts.endedEarly,
      minutesDifference: minutes - scheduledMinutes,
    });

    setEditModalVisible(false);
    setEditingMeeting(null);
    setNewDuration('');
    loadHistory();
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

      {/* Edit Duration Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <AppText variant="h3" style={styles.modalTitle}>
              Edit Meeting Duration
            </AppText>

            {editingMeeting && (
              <AppText variant="body" color={Colors.textSecondary} style={styles.modalSubtitle}>
                {editingMeeting.title}
              </AppText>
            )}

            <View style={styles.inputContainer}>
              <AppText variant="bodySmall" color={Colors.textSecondary} style={styles.inputLabel}>
                Duration (minutes)
              </AppText>
              <TextInput
                style={styles.textInput}
                value={newDuration}
                onChangeText={setNewDuration}
                keyboardType="number-pad"
                placeholder="Enter minutes"
                autoFocus
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={() => {
                  setEditModalVisible(false);
                  setEditingMeeting(null);
                  setNewDuration('');
                }}
                style={styles.modalButton}
              />
              <Button
                title="Save"
                variant="primary"
                onPress={handleSaveEditedDuration}
                style={styles.modalButton}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  modalTitle: {
    marginBottom: Spacing.xs,
  },
  modalSubtitle: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    marginBottom: Spacing.xs,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modalButton: {
    flex: 1,
  },
});

export default HistoryScreen;
