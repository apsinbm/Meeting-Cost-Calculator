import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AppText, Card, Button, AttendeePickerModal } from '../../components';
import { Colors, Spacing } from '../../constants';
import { scaledFontSize } from '../../utils/iPadOptimization';
import EmployeeService from '../../services/EmployeeService';
import MeetingCostCalculator from '../../services/MeetingCostCalculator';
import EmployeeCostCalculator from '../../services/EmployeeCostCalculator';

/**
 * Meeting Cost Predictor Screen
 * Calculate predicted meeting costs to help decide if a meeting is worth having
 */
const MeetingPredictorScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [duration, setDuration] = useState(30); // Default 30 minutes
  const [modalVisible, setModalVisible] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

  useFocusEffect(
    useCallback(() => {
      loadEmployees();
    }, [])
  );

  useEffect(() => {
    if (selectedAttendees.length > 0) {
      calculatePrediction();
    } else {
      setPrediction(null);
    }
  }, [selectedAttendees, duration]);

  const loadEmployees = async () => {
    try {
      const allEmployees = await EmployeeService.getEmployees();
      setEmployees(allEmployees);
    } catch (error) {
      console.error('Error loading employees:', error);
      Alert.alert('Error', 'Failed to load employees. Please try again.');
    }
  };

  const calculatePrediction = () => {
    const result = MeetingCostCalculator.calculatePreMeetingCost(selectedAttendees, duration);
    setPrediction(result);
  };

  const handleSelectAttendees = () => {
    if (employees.length === 0) {
      Alert.alert(
        'No Employees',
        'Add employees first to calculate meeting costs.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Employees', onPress: () => navigation.navigate('EmployeeList') },
        ]
      );
      return;
    }
    setModalVisible(true);
  };

  const handleConfirmAttendees = (selected) => {
    setSelectedAttendees(selected);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Attendee Picker Modal */}
      <AttendeePickerModal
        visible={modalVisible}
        employees={employees}
        selectedEmployees={selectedAttendees}
        onConfirm={handleConfirmAttendees}
        onCancel={() => setModalVisible(false)}
        onAddEmployee={() => {
          setModalVisible(false);
          navigation.navigate('AddEmployee', {
            onEmployeeAdded: async () => {
              await loadEmployees();
              setTimeout(() => setModalVisible(true), 300);
            },
          });
        }}
        mode="select"
      />

      {/* Header */}
      <View style={styles.header}>
        <AppText variant="h3" style={styles.headerTitle}>Meeting Cost Calculator</AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={styles.headerSubtitle}>
          Plan smarter meetings
        </AppText>
      </View>

      <ScrollView style={styles.content}>
        {/* Instructions */}
        <Card style={{ marginBottom: Spacing.md }}>
          <AppText variant="body" color={Colors.textSecondary}>
            Calculate the cost of a meeting before having it. Use this to decide if the meeting is worth it, or if fewer people should attend.
          </AppText>
        </Card>

        {/* Attendee Selection */}
        <Card style={{ marginBottom: Spacing.md }}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Who will attend?
          </AppText>
          {selectedAttendees.length === 0 ? (
            <AppText variant="body" color={Colors.textSecondary} style={{ marginBottom: Spacing.md }}>
              No attendees selected
            </AppText>
          ) : (
            <View style={{ marginBottom: Spacing.md }}>
              {selectedAttendees.map((attendee, index) => (
                <View key={index} style={styles.attendeeRow}>
                  <View style={styles.attendeeAvatar}>
                    <AppText variant="bodySmall" color={Colors.primary}>
                      {attendee.name.charAt(0)}
                    </AppText>
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText variant="body">{attendee.name}</AppText>
                    <AppText variant="caption" color={Colors.textSecondary}>
                      {attendee.role} • {EmployeeCostCalculator.formatPerMinuteCost(attendee.perMinuteCost)}
                    </AppText>
                  </View>
                </View>
              ))}
            </View>
          )}
          <View style={styles.attendeeButtons}>
            <Button
              title={selectedAttendees.length === 0 ? 'Select Attendees' : 'Change'}
              variant="secondary"
              onPress={handleSelectAttendees}
              style={selectedAttendees.length > 0 ? { flex: 1, flexBasis: '0%', marginRight: Spacing.sm } : {}}
            />
            {selectedAttendees.length > 0 && (
              <Button
                title="Clear"
                variant="secondary"
                onPress={() => setSelectedAttendees([])}
                style={{ flex: 1, flexBasis: '0%' }}
              />
            )}
          </View>
        </Card>

        {/* Duration Selection */}
        <Card style={{ marginBottom: Spacing.md }}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Meeting Duration
          </AppText>
          <View style={styles.durationGrid}>
            {DURATION_OPTIONS.map((mins) => (
              <TouchableOpacity
                key={mins}
                style={[
                  styles.durationButton,
                  duration === mins && styles.durationButtonSelected,
                ]}
                onPress={() => setDuration(mins)}
              >
                <AppText
                  variant="body"
                  color={duration === mins ? Colors.white : Colors.textPrimary}
                >
                  {mins} min
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Cost Prediction */}
        {prediction && (
          <>
            <Card style={{ marginBottom: Spacing.md }}>
              <AppText variant="bodySmall" color={Colors.textSecondary} style={styles.costLabel}>
                PREDICTED COST
              </AppText>
              <AppText variant="h1" color={Colors.primary} style={styles.totalCost}>
                {EmployeeCostCalculator.formatCurrency(prediction.totalCost)}
              </AppText>
              <AppText variant="body" color={Colors.textSecondary} style={{ textAlign: 'center' }}>
                for {duration} minutes with {selectedAttendees.length} {selectedAttendees.length === 1 ? 'person' : 'people'}
              </AppText>
            </Card>

            {/* Milestone Costs */}
            <Card style={{ marginBottom: Spacing.md }}>
              <AppText variant="h3" style={styles.sectionTitle}>
                Cost at Milestones
              </AppText>
              {prediction.milestones.map((milestone) => (
                <View key={milestone.timeMinutes} style={styles.milestoneRow}>
                  <AppText variant="body">{milestone.timeMinutes} minutes</AppText>
                  <AppText variant="bodyLarge" color={Colors.primary}>
                    {EmployeeCostCalculator.formatCurrency(milestone.cost)}
                  </AppText>
                </View>
              ))}
            </Card>

            {/* Per-Attendee Breakdown */}
            <Card style={{ marginBottom: Spacing.md }}>
              <AppText variant="h3" style={styles.sectionTitle}>
                Cost Per Attendee
              </AppText>
              {prediction.attendeeCosts && prediction.attendeeCosts.map((attendee, index) => (
                <View key={index} style={styles.attendeeRow}>
                  <View style={styles.attendeeAvatar}>
                    <AppText variant="bodySmall" color={Colors.primary}>
                      {attendee.name.charAt(0)}
                    </AppText>
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText variant="body">{attendee.name}</AppText>
                    <AppText variant="caption" color={Colors.textSecondary}>
                      {attendee.role}
                    </AppText>
                  </View>
                  <AppText variant="bodyLarge" color={Colors.primary}>
                    {EmployeeCostCalculator.formatCurrency(attendee.cost)}
                  </AppText>
                </View>
              ))}
            </Card>

            {/* Insights */}
            <Card style={{ marginBottom: Spacing.xl }}>
              <AppText variant="h3" style={styles.sectionTitle}>
                💡 Insights
              </AppText>
              <View style={styles.insightItem}>
                <AppText variant="body" color={Colors.textSecondary}>
                  • This meeting costs{' '}
                  <AppText variant="body" style={{ fontWeight: '600' }}>
                    ${(prediction.totalCost / 60).toFixed(2)} per minute
                  </AppText>
                </AppText>
              </View>
              {prediction.attendeeCosts && prediction.attendeeCosts.length > 0 && (() => {
                const maxCost = prediction.attendeeCosts.reduce((max, a) => Math.max(max, a.cost), 0);
                return (
                  <View style={styles.insightItem}>
                    <AppText variant="body" color={Colors.textSecondary}>
                      • Removing the highest-cost attendee would save{' '}
                      <AppText variant="body" style={{ fontWeight: '600' }}>
                        {EmployeeCostCalculator.formatCurrency(maxCost)}
                      </AppText>
                    </AppText>
                  </View>
                );
              })()}
              <View style={styles.insightItem}>
                <AppText variant="body" color={Colors.textSecondary}>
                  • Reducing duration to {Math.floor(duration / 2)} minutes would save{' '}
                  <AppText variant="body" style={{ fontWeight: '600' }}>
                    {EmployeeCostCalculator.formatCurrency(prediction.totalCost / 2)}
                  </AppText>
                </AppText>
              </View>
            </Card>
          </>
        )}
      </ScrollView>
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
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: scaledFontSize(17),
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: scaledFontSize(11),
    marginTop: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  attendeeAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  attendeeButtons: {
    flexDirection: 'row',
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
  durationButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    alignItems: 'center',
  },
  durationButtonSelected: {
    backgroundColor: Colors.primary,
  },
  costLabel: {
    letterSpacing: 2,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  totalCost: {
    fontSize: scaledFontSize(40),
    fontWeight: '700',
    lineHeight: scaledFontSize(50),
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  milestoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  insightItem: {
    marginBottom: Spacing.sm,
  },
});

export default MeetingPredictorScreen;
