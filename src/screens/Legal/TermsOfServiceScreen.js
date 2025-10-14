import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button } from '../../components';
import { Colors, Spacing } from '../../constants';

/**
 * Terms of Service Screen
 * Displays the app's terms of service
 */
const TermsOfServiceScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AppText variant="body" color={Colors.primary} style={styles.backButtonText}>
            ‹ Back
          </AppText>
        </TouchableOpacity>
        <AppText variant="h2">Terms of Service</AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={styles.lastUpdated}>
          Last Updated: October 2025
        </AppText>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <AppText variant="h3" style={styles.sectionTitle}>
          1. Acceptance of Terms
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          By downloading, installing, or using Meeting Cost Calculator (the "App"), you agree to be bound by these Terms of Service. If you do not agree to these Terms, do not use the App.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          2. Description of Service
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          Meeting Cost Calculator is a mobile application that helps you calculate the true cost of meetings based on employee compensation, track meeting costs in real-time, analyze meeting expenses and patterns, and make data-driven decisions about meeting efficiency.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          3. Use of the App
        </AppText>
        <AppText variant="bodySmall" style={styles.subsectionTitle}>
          Permitted Use
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          You may use this App for personal business productivity, internal company cost analysis, meeting planning and optimization, and employee cost calculation.
        </AppText>

        <AppText variant="bodySmall" style={styles.subsectionTitle}>
          Restrictions
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          You may NOT:{'\n'}
          • Use the App for illegal purposes{'\n'}
          • Reverse engineer, decompile, or disassemble the App{'\n'}
          • Remove or modify any proprietary notices{'\n'}
          • Use the App to make employment decisions that violate labor laws{'\n'}
          • Share salary data without proper authorization{'\n'}
          • Use the App in a way that violates others' privacy rights
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          4. Data and Privacy
        </AppText>
        <AppText variant="bodySmall" style={styles.subsectionTitle}>
          Your Data
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          • You own all data you enter into the App{'\n'}
          • All data is stored locally on your device{'\n'}
          • We do not have access to your data{'\n'}
          • You are responsible for the accuracy of data you enter
        </AppText>

        <AppText variant="bodySmall" style={styles.subsectionTitle}>
          Data Security
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          You are responsible for securing your device. Enable device encryption and passcode protection. We are not liable for data loss due to device failure, theft, or damage.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          5. Calculations and Accuracy
        </AppText>
        <AppText variant="bodySmall" style={styles.subsectionTitle}>
          Estimates Only
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          Cost calculations provided by the App are <AppText variant="body" style={styles.bold}>estimates based on data you provide</AppText>. These estimates:{'\n'}
          • Use simplified Bermuda employment cost formulas{'\n'}
          • May not reflect actual accounting costs{'\n'}
          • Are for informational purposes only{'\n'}
          • Should not be used as the sole basis for financial or employment decisions
        </AppText>

        <AppText variant="bodySmall" style={styles.subsectionTitle}>
          Bermuda Employment Costs
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          The App uses simplified calculations for:{'\n'}
          • Payroll Tax: 10% (actual rates vary by company size and industry: 1-10%){'\n'}
          • Social Insurance: 5% (actual rate is $37.65/week fixed amount){'\n'}
          • Health Insurance: User-configurable (default $12,000 annually){'\n'}
          • Pension Contributions: 5% employer match
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          See "About Our Calculations" in the App for detailed disclaimers.
        </AppText>

        <AppText variant="bodySmall" style={styles.subsectionTitle}>
          No Professional Advice
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          This App does not provide financial advice, legal advice, tax advice, accounting services, or employment law guidance. Consult qualified professionals for important business decisions.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          6. Disclaimer of Warranties
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:{'\n'}
          • Warranties of merchantability{'\n'}
          • Fitness for a particular purpose{'\n'}
          • Non-infringement{'\n'}
          • Accuracy or reliability of calculations{'\n'}
          • Uninterrupted or error-free operation{'\n'}
          • Security of data stored on your device
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          7. Limitation of Liability
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR:{'\n'}
          • Any indirect, incidental, special, consequential, or punitive damages{'\n'}
          • Loss of profits, revenue, data, or business opportunities{'\n'}
          • Business decisions made based on App calculations{'\n'}
          • Data loss due to device failure or user error{'\n'}
          • Inaccurate calculations due to incorrect input data{'\n'}
          • Employment decisions made using App data{'\n'}
          • Tax or legal compliance issues
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          8. Employment Law Compliance
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          You are solely responsible for:{'\n'}
          • Compliance with employment laws in your jurisdiction{'\n'}
          • Proper handling of employee salary information{'\n'}
          • Obtaining necessary consents to store employee data{'\n'}
          • Making employment decisions in accordance with applicable laws
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          9. Calendar Access
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          Calendar access is optional but enables automatic meeting detection, attendee matching, and pre-calculated meeting costs.
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          We only READ calendar data. We never create, modify, or delete calendar events, or share calendar data with third parties.
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          You may revoke calendar access at any time through device Settings.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          10. Data Deletion
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          You have the right to delete individual employees, individual meetings, all meetings, or all data (complete reset). Data deletion is permanent and cannot be recovered.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          11. Updates and Changes
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          We may release updates to improve functionality, fix bugs, or enhance security. We reserve the right to modify these Terms at any time. Changes will be reflected in the "Last Updated" date. Continued use after changes constitutes acceptance.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          12. Termination
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          You may stop using the App at any time by uninstalling it from your device and deleting all data using the "Delete All Data" feature. We may discontinue the App or deny access if you violate these Terms.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          13. Governing Law
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          These Terms shall be governed by the laws of Bermuda, without regard to conflict of law principles.
        </AppText>

        <View style={styles.acknowledgment}>
          <AppText variant="body" style={styles.bold}>
            Acknowledgment
          </AppText>
          <AppText variant="body" style={styles.paragraph}>
            BY USING THIS APP, YOU ACKNOWLEDGE THAT:{'\n'}
            • You have read and understood these Terms{'\n'}
            • You agree to be bound by these Terms{'\n'}
            • You understand this App provides estimates, not professional advice{'\n'}
            • You are responsible for data accuracy and legal compliance{'\n'}
            • Your data is stored locally and is not backed up by us{'\n'}
            • You will consult professionals for important business decisions
          </AppText>
        </View>

        <View style={styles.summary}>
          <AppText variant="bodySmall" style={styles.bold}>
            Summary
          </AppText>
          <AppText variant="bodySmall" style={styles.paragraph}>
            Use this App responsibly. Calculations are estimates. Consult professionals for important decisions. Your data stays on your device. We're not liable for business decisions made using this tool.
          </AppText>
        </View>

        <View style={{ height: Spacing.xl }} />
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
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
    marginLeft: -Spacing.xs,
  },
  backButtonText: {
    fontSize: 17,
  },
  lastUpdated: {
    marginTop: Spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  subsectionTitle: {
    fontWeight: '600',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  paragraph: {
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '600',
  },
  acknowledgment: {
    backgroundColor: Colors.warningLight,
    padding: Spacing.md,
    borderRadius: 8,
    marginTop: Spacing.lg,
  },
  summary: {
    backgroundColor: Colors.successLight,
    padding: Spacing.md,
    borderRadius: 8,
    marginTop: Spacing.md,
  },
});

export default TermsOfServiceScreen;
