import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AppText, Card, EditTextModal, CurrencyPickerModal } from '../../components';
import { Colors, Spacing } from '../../constants';
import EmployeeService from '../../services/EmployeeService';
import CompanyService from '../../services/CompanyService';
import MeetingService from '../../services/MeetingService';
import StorageService from '../../services/StorageService';
import ExportService from '../../services/ExportService';

/**
 * Settings Screen
 * App configuration and employee management
 */
const SettingsScreen = ({ navigation }) => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [companySettings, setCompanySettings] = useState(null);
  const [editNameModalVisible, setEditNameModalVisible] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [editWorkHoursModalVisible, setEditWorkHoursModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadEmployeeCount();
      loadCompanySettings();
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

  const loadCompanySettings = async () => {
    try {
      const settings = await CompanyService.getSettings();
      setCompanySettings(settings);
    } catch (error) {
      console.error('Error loading company settings:', error);
    }
  };

  const handleSaveCompanyName = async (name) => {
    const result = await CompanyService.updateCompanyName(name);
    if (result.success) {
      setCompanySettings(result.settings);
    }
    setEditNameModalVisible(false);
  };

  const handleSaveCurrency = async (currencyCode) => {
    const result = await CompanyService.updateCurrency(currencyCode);
    if (result.success) {
      setCompanySettings(result.settings);
    }
    setCurrencyModalVisible(false);
  };

  const validateWorkHours = (hoursStr) => {
    const hours = parseFloat(hoursStr);
    if (isNaN(hours) || hours <= 0 || hours > 168) {
      return 'Please enter a valid number of hours (1-168)';
    }
    return null; // No error
  };

  const handleSaveWorkHours = async (hoursStr) => {
    const hours = parseFloat(hoursStr);
    const result = await CompanyService.updateWorkWeekHours(hours);
    if (result.success) {
      setCompanySettings(result.settings);
    }
    setEditWorkHoursModalVisible(false);
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete ALL employees, meetings, and settings. This cannot be undone. Are you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete all data
              await EmployeeService.deleteAllEmployees();
              await MeetingService.deleteAllMeetings();
              await StorageService.removeData('@company_settings');

              // Reload data
              await loadEmployeeCount();
              await loadCompanySettings();

              Alert.alert('Success', 'All data has been deleted.');
            } catch (error) {
              console.error('Error deleting all data:', error);
              Alert.alert('Error', 'Failed to delete all data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleManageCalendarPermissions = () => {
    Alert.alert(
      'Calendar Permissions',
      'To manage calendar permissions, go to:\n\nSettings → Privacy & Security → Calendars → Meeting Cost Calculator\n\nYou can enable or disable calendar access there.',
      [{ text: 'Open Settings', onPress: () => Linking.openSettings() }, { text: 'Cancel', style: 'cancel' }]
    );
  };

  const handleExportEmployees = async () => {
    try {
      const result = await ExportService.exportEmployeesToCSV();
      if (!result.success) {
        Alert.alert('Export Failed', result.error || 'Unable to export employees');
      }
    } catch (error) {
      console.error('Error exporting employees:', error);
      Alert.alert('Export Failed', 'An error occurred while exporting employees');
    }
  };

  const handleExportAllData = async () => {
    Alert.alert(
      'Export All Data',
      'This will export your employees and meeting history as CSV files. These files will contain sensitive salary information.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: async () => {
            try {
              await ExportService.exportEmployeesToCSV();
              await ExportService.exportMeetingsToCSV();
            } catch (error) {
              console.error('Error exporting data:', error);
              Alert.alert('Export Failed', 'An error occurred while exporting data');
            }
          },
        },
      ]
    );
  };

  if (!companySettings) {
    return null; // Loading
  }

  const currencyInfo = CompanyService.getCurrency(companySettings.currency);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Modals */}
      <EditTextModal
        visible={editNameModalVisible}
        title="Company Name"
        label="Enter your company name"
        value={companySettings.companyName}
        placeholder="Acme Corporation"
        onConfirm={handleSaveCompanyName}
        onCancel={() => setEditNameModalVisible(false)}
      />

      <CurrencyPickerModal
        visible={currencyModalVisible}
        selectedCurrency={companySettings.currency}
        onConfirm={handleSaveCurrency}
        onCancel={() => setCurrencyModalVisible(false)}
      />

      <EditTextModal
        visible={editWorkHoursModalVisible}
        title="Work Week Hours"
        label="Enter weekly work hours"
        value={companySettings.workWeekHours.toString()}
        placeholder="40"
        keyboardType="numeric"
        onConfirm={handleSaveWorkHours}
        onCancel={() => setEditWorkHoursModalVisible(false)}
        validation={validateWorkHours}
      />

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
            value={companySettings.companyName || 'Not set'}
            onPress={() => setEditNameModalVisible(true)}
          />
          <SettingsItem
            title="Currency"
            value={currencyInfo.name}
            onPress={() => setCurrencyModalVisible(true)}
          />
          <SettingsItem
            title="Work Week Hours"
            value={`${companySettings.workWeekHours} hours`}
            onPress={() => setEditWorkHoursModalVisible(true)}
          />
        </View>

        {/* Employment Costs Section */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Bermuda Employment Costs
          </AppText>
          <SettingsItem
            title="Payroll Tax Rate"
            value="10% of annual salary"
            onPress={() => {}}
            disabled
          />
          <SettingsItem
            title="Employer Pension Match"
            value="5% of annual salary"
            onPress={() => {}}
            disabled
          />
          <SettingsItem
            title="Social Insurance"
            value="$37.65/week ($1,957.80/year)"
            onPress={() => {}}
            disabled
          />
          <SettingsItem
            title="Health Insurance"
            value="$500/month ($6,000/year)"
            onPress={() => {}}
            disabled
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
          {employeeCount > 0 && (
            <SettingsItem
              title="Export Employees"
              value="Download as CSV"
              onPress={handleExportEmployees}
            />
          )}
        </View>

        {/* Privacy & Permissions Section */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Privacy & Permissions
          </AppText>
          <SettingsItem
            title="Calendar Access"
            value="Manage permissions"
            onPress={handleManageCalendarPermissions}
          />
          <SettingsItem
            title="Export All Data"
            value="Employees & meetings"
            onPress={handleExportAllData}
          />
          <SettingsItem
            title="Delete All Data"
            value="Employees & meetings"
            onPress={handleDeleteAllData}
          />
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Legal
          </AppText>
          <SettingsItem
            title="Privacy Policy"
            value="How we handle your data"
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          <SettingsItem
            title="Terms of Service"
            value="Terms & conditions"
            onPress={() => navigation.navigate('TermsOfService')}
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
          <SettingsItem
            title="Show Welcome Screen"
            value="View app introduction"
            onPress={() => {
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate('Welcome');
              }
            }}
          />
          <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: Spacing.sm, textAlign: 'center' }}>
            Version 1.0.7
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: Spacing.xs, textAlign: 'center' }}>
            Your data never leaves your device
          </AppText>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingsItem = ({ title, value, onPress, disabled = false }) => (
  <TouchableOpacity onPress={disabled ? undefined : onPress} disabled={disabled} activeOpacity={disabled ? 1 : 0.7}>
    <Card style={styles.settingsItem}>
      <View style={styles.settingsItemContent}>
        <AppText variant="body" color={disabled ? Colors.textSecondary : Colors.textPrimary}>{title}</AppText>
        <View style={styles.settingsItemValue}>
          <AppText variant="body" color={Colors.textSecondary}>
            {value}
          </AppText>
          {!disabled && (
            <AppText variant="body" color={Colors.textSecondary}>
              {' ›'}
            </AppText>
          )}
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
