import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AppText, Card, EditTextModal, CurrencyPickerModal } from '../../components';
import { Colors, Spacing } from '../../constants';
import { BermudaDefaults } from '../../constants';
import EmployeeService from '../../services/EmployeeService';
import EmployeeCostCalculator from '../../services/EmployeeCostCalculator';
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
      // Recalculate all employee costs with new work-week hours
      await EmployeeService.recalculateAllCosts();
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
            value="BMD ($) — All amounts displayed in $"
            onPress={() => {}}
            disabled
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
            value="8 plan options per employee"
            onPress={() => {}}
            disabled
          />
        </View>

        {/* Health Insurance Plans Detail */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Health Insurance Plans
          </AppText>
          <AppText variant="bodySmall" color={Colors.textSecondary} style={{ marginBottom: Spacing.md }}>
            Employees select one plan during setup. Costs included in meeting calculations.
          </AppText>
          {BermudaDefaults.healthInsurancePlans.map((plan, index) => (
            <Card key={index} style={styles.planInfoCard}>
              <View style={styles.planInfoRow}>
                <View style={styles.planInfoContent}>
                  <AppText variant="bodySmall" style={styles.planInfoTitle}>
                    {plan.name}
                  </AppText>
                  <AppText variant="caption" color={Colors.textSecondary}>
                    {EmployeeCostCalculator.formatCurrency(plan.monthly)}/mo • {EmployeeCostCalculator.formatCurrency(plan.annual)}/year
                  </AppText>
                </View>
              </View>
            </Card>
          ))}
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

        {/* Privacy & Data Section */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Privacy & Data
          </AppText>
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
          <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: Spacing.sm, textAlign: 'center', fontSize: 9 }}>
            Version 1.0.30
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: Spacing.xs, textAlign: 'center', fontSize: 9 }}>
            Your data never leaves your device
          </AppText>
          <AppText variant="body" color={Colors.textSecondary} style={{ marginTop: Spacing.lg, textAlign: 'center', fontStyle: 'italic', paddingHorizontal: Spacing.lg, fontSize: 12.6 }}>
            "The most efficient meeting is the one that never happened."
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
        <AppText variant="body" color={disabled ? Colors.textSecondary : Colors.textPrimary} style={styles.settingsItemTitle}>
          {title}
        </AppText>
        <View style={styles.settingsItemValue}>
          <AppText variant="bodySmall" color={Colors.textSecondary} style={styles.settingsItemValueText} numberOfLines={1} adjustsFontSizeToFit>
            {value}
          </AppText>
          {!disabled && (
            <AppText variant="body" color={Colors.textSecondary} style={styles.settingsItemArrow}>
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
    fontSize: 15.3,  // h3 (17) * 0.9
  },
  settingsItem: {
    marginBottom: 1,
    borderRadius: 0,
  },
  settingsItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  settingsItemTitle: {
    flex: 1,
    marginRight: Spacing.xs,
    fontSize: 12.6,  // body (14) * 0.9
  },
  settingsItemValue: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    maxWidth: '60%',  // increased from 50% to prevent cutting off numbers
  },
  settingsItemValueText: {
    textAlign: 'right',
    flexShrink: 1,
    flex: 1,  // allow text to take up available space
    fontSize: 10.8,  // bodySmall (12) * 0.9
  },
  settingsItemArrow: {
    marginLeft: 4,
    flexShrink: 0,
    fontSize: 12.6,  // body (14) * 0.9
  },
  planInfoCard: {
    marginBottom: Spacing.xs,
    borderRadius: 4,
  },
  planInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planInfoContent: {
    flex: 1,
  },
  planInfoTitle: {
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
});

export default SettingsScreen;
