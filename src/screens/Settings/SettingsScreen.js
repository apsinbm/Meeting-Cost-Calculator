import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AppText, Card } from '../../components';
import { Colors, Spacing } from '../../constants';
import EmployeeService from '../../services/EmployeeService';

/**
 * Settings Screen
 * App configuration and employee management
 */
const SettingsScreen = ({ navigation }) => {
  const [employeeCount, setEmployeeCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadEmployeeCount();
    }, [])
  );

  const loadEmployeeCount = async () => {
    try {
      const employees = await EmployeeService.getEmployees();
      setEmployeeCount(employees.length);
    } catch (error) {
      console.error('Error loading employee count:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="h2">Settings</AppText>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Company Configuration Section */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Company Settings
          </AppText>
          <SettingsItem
            title="Company Name"
            value="Not set"
            onPress={() => {}}
          />
          <SettingsItem
            title="Currency"
            value="BMD (Bermuda Dollar)"
            onPress={() => {}}
          />
          <SettingsItem
            title="Work Week Hours"
            value="40 hours"
            onPress={() => {}}
          />
        </View>

        {/* Employment Costs Section */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Bermuda Employment Costs
          </AppText>
          <SettingsItem
            title="Payroll Tax Rate"
            value="10%"
            onPress={() => {}}
          />
          <SettingsItem
            title="Social Insurance Rate"
            value="5%"
            onPress={() => {}}
          />
          <SettingsItem
            title="Standard Health Insurance"
            value="$12,000/year"
            onPress={() => {}}
          />
        </View>

        {/* Employees Section */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Employees
          </AppText>
          <SettingsItem
            title="Manage Employees"
            value={employeeCount === 0 ? 'No employees yet' : `${employeeCount} employee${employeeCount !== 1 ? 's' : ''}`}
            onPress={() => navigation.navigate('EmployeeList')}
          />
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            About
          </AppText>
          <SettingsItem
            title="About Our Calculations"
            value="Details & limitations"
            onPress={() => navigation.navigate('AboutCalculations')}
          />
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingsItem = ({ title, value, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Card style={styles.settingsItem}>
      <View style={styles.settingsItemContent}>
        <AppText variant="body">{title}</AppText>
        <View style={styles.settingsItemValue}>
          <AppText variant="body" color={Colors.textSecondary}>
            {value}
          </AppText>
          <AppText variant="body" color={Colors.textSecondary}>
            {' ›'}
          </AppText>
        </View>
      </View>
    </Card>
  </TouchableOpacity>
);

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
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  settingsItem: {
    marginBottom: 1,
    borderRadius: 0,
  },
  settingsItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsItemValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SettingsScreen;
