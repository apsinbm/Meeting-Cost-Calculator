import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AppText, Button, AttendeePickerModal } from '../../components';
import { Colors, Spacing } from '../../constants';
import EmployeeService from '../../services/EmployeeService';

/**
 * Start Meeting Screen
 * Quick access to start an ad-hoc meeting
 */
const StartMeetingScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadEmployees();
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

  const handleStartMeeting = () => {
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

    setModalVisible(true);
  };

  const handleConfirmAttendees = (selectedEmployees) => {
    if (selectedEmployees.length === 0) {
      Alert.alert('No Attendees', 'Please select at least one attendee.');
      return;
    }

    const manualMeeting = {
      title: 'Ad-hoc Meeting',
      scheduledStart: new Date().toISOString(),
      isManual: true,
    };

    setModalVisible(false);

    navigation.navigate('ActiveMeeting', {
      meeting: manualMeeting,
      attendees: selectedEmployees,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Attendee Picker Modal */}
      <AttendeePickerModal
        visible={modalVisible}
        employees={employees}
        selectedEmployees={[]}
        onConfirm={handleConfirmAttendees}
        onCancel={() => setModalVisible(false)}
        onAddEmployee={() => {
          setModalVisible(false);
          navigation.navigate('AddEmployee', {
            onEmployeeAdded: () => {
              loadEmployees();
              setTimeout(() => setModalVisible(true), 100);
            },
          });
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <AppText variant="h2">Start Meeting</AppText>
        <AppText variant="bodySmall" color={Colors.textSecondary} style={{ marginTop: Spacing.xs }}>
          Begin tracking an ad-hoc meeting
        </AppText>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.centerContent}>
          <TouchableOpacity
            onPress={employees.length === 0 ? () => navigation.navigate('EmployeeList') : handleStartMeeting}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../../assets/play-button.png')}
              style={styles.playButtonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <AppText variant="h3" style={styles.title}>
            Ready to start?
          </AppText>

          <AppText variant="body" color={Colors.textSecondary} style={styles.description}>
            Select attendees and begin tracking meeting costs in real-time
          </AppText>

          {employees.length > 0 && (
            <AppText variant="bodySmall" color={Colors.textSecondary} style={styles.employeeCount}>
              {employees.length} employee{employees.length !== 1 ? 's' : ''} available
            </AppText>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title={employees.length === 0 ? 'Add Employees First' : 'Start New Meeting'}
              onPress={employees.length === 0 ? () => navigation.navigate('EmployeeList') : handleStartMeeting}
              style={styles.startButton}
            />
          </View>

          {employees.length === 0 && (
            <AppText variant="caption" color={Colors.warning} style={styles.warning}>
              Add at least one employee to start tracking meeting costs
            </AppText>
          )}
        </View>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  playButtonImage: {
    width: 180,
    height: 180,
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  employeeCount: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  startButton: {
    width: '100%',
  },
  warning: {
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});

export default StartMeetingScreen;
