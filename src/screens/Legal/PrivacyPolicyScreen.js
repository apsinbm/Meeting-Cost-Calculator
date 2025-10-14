import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button } from '../../components';
import { Colors, Spacing } from '../../constants';

/**
 * Privacy Policy Screen
 * Displays the app's privacy policy
 */
const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AppText variant="body" color={Colors.primary} style={styles.backButtonText}>
            ‹ Back
          </AppText>
        </TouchableOpacity>
        <AppText variant="h2">Privacy Policy</AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={styles.lastUpdated}>
          Last Updated: October 2025
        </AppText>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <AppText variant="h3" style={styles.sectionTitle}>
          Overview
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          Meeting Cost Calculator is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our mobile application.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          Our Privacy-First Philosophy
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          <AppText variant="body" style={styles.bold}>Your data never leaves your device.</AppText> Meeting Cost Calculator is designed with privacy as the foundation. All data is stored locally on your device using secure storage mechanisms provided by your mobile operating system.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          Information We Collect
        </AppText>
        <AppText variant="bodySmall" style={styles.subsectionTitle}>
          Information You Provide
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          • Employee Data: Names, roles, email addresses (optional), salary information, bonus amounts, and benefits details{'\n'}
          • Meeting Data: Meeting titles, dates, times, durations, and attendee information{'\n'}
          • Company Settings: Company name, preferred currency, and work week hours
        </AppText>

        <AppText variant="bodySmall" style={styles.subsectionTitle}>
          Information We Access
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          • Calendar Data: With your explicit permission, the App reads your device calendar to display upcoming meetings, match calendar attendees to employee profiles, and pre-calculate meeting costs.
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          <AppText variant="body" style={styles.bold}>Important:</AppText> We only READ calendar data. We never write to, modify, or delete calendar events.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          How We Use Your Information
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          All data is used exclusively for calculating employment costs, tracking meeting costs in real-time, generating meeting history and cost reports, and matching calendar attendees to employee profiles.
        </AppText>

        <AppText variant="bodySmall" style={styles.subsectionTitle}>
          We Do NOT
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          • Transmit your data to external servers{'\n'}
          • Use cloud storage or sync services{'\n'}
          • Share your data with third parties{'\n'}
          • Use your data for advertising or marketing{'\n'}
          • Track your usage or behavior{'\n'}
          • Collect analytics or telemetry
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          Data Storage and Security
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          • <AppText variant="body" style={styles.bold}>Local Storage Only:</AppText> All data is stored on your device using AsyncStorage (encrypted by your device's built-in security){'\n'}
          • <AppText variant="body" style={styles.bold}>Device Encryption:</AppText> Your data benefits from iOS/Android device-level encryption{'\n'}
          • <AppText variant="body" style={styles.bold}>No Cloud Sync:</AppText> Data remains exclusively on your device{'\n'}
          • <AppText variant="body" style={styles.bold}>No Accounts:</AppText> No login, no user accounts, no authentication servers{'\n'}
          • <AppText variant="body" style={styles.bold}>No Backups:</AppText> Data is not backed up to our servers
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          Email Reports
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          When you generate an email report, the report is created on your device and your device's native email app is opened. You control who receives the report. The email is sent from YOUR email account, not through our servers. We never see or store the email addresses you send reports to.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          Calendar Permissions
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          We request calendar access to read your scheduled meetings, extract meeting attendee information, and pre-calculate meeting costs. You can deny calendar access and still use the app (manual meeting entry), revoke calendar access at any time through device Settings, or use the app fully without granting calendar access.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          Your Rights and Choices
        </AppText>
        <AppText variant="bodySmall" style={styles.subsectionTitle}>
          Access Your Data
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          All your data is visible within the app in the Employees section, History section, and Settings section.
        </AppText>

        <AppText variant="bodySmall" style={styles.subsectionTitle}>
          Delete Your Data
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          You can delete data at multiple levels:{'\n'}
          • Individual Employees: Delete from Employee list{'\n'}
          • Individual Meetings: Delete from History screen{'\n'}
          • All Meetings: "Delete All Meetings" button in History{'\n'}
          • All Data: "Delete All Data" button in Settings
        </AppText>

        <AppText variant="bodySmall" style={styles.subsectionTitle}>
          Revoke Permissions
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          Calendar access can be revoked through your device Settings → Privacy → Calendars. Once revoked, the app will still function but will not display calendar meetings.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          Children's Privacy
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          This app is intended for business professionals and is not directed at children under 13. We do not knowingly collect information from children.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          Changes to This Policy
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          We may update this Privacy Policy from time to time. Changes will be reflected in the "Last Updated" date. Continued use of the app after changes constitutes acceptance of the updated policy.
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          Data Protection Compliance
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          This app is designed to comply with GDPR, CCPA, and other applicable data protection laws. Your rights include:{'\n'}
          • Right to Access: View all your data in the app{'\n'}
          • Right to Deletion: Delete data through app features{'\n'}
          • Right to Portability: Export data via email reports{'\n'}
          • Right to Rectification: Edit employee and meeting data{'\n'}
          • Right to Restriction: Control calendar access permissions
        </AppText>

        <AppText variant="h3" style={styles.sectionTitle}>
          Legal Disclaimers
        </AppText>
        <AppText variant="bodySmall" style={styles.subsectionTitle}>
          Calculation Accuracy
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          This app provides cost estimates based on data you provide. We do not guarantee the accuracy of calculations. You are responsible for entering accurate salary and benefits data, verifying calculations meet your needs, and consulting with financial or legal professionals for important decisions.
        </AppText>

        <AppText variant="bodySmall" style={styles.subsectionTitle}>
          Employment Law Compliance
        </AppText>
        <AppText variant="body" style={styles.paragraph}>
          Bermuda employment cost calculations use simplified rates for ease of use. See "About Our Calculations" in Settings for detailed information.
        </AppText>

        <View style={styles.keyTakeaway}>
          <AppText variant="body" style={styles.bold}>
            Key Takeaway
          </AppText>
          <AppText variant="body" style={styles.paragraph}>
            Your salary data and employee information never leave your device. We have no servers, no databases, and no way to access your information. Your privacy is guaranteed by design.
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
  keyTakeaway: {
    backgroundColor: Colors.infoLight,
    padding: Spacing.md,
    borderRadius: 8,
    marginTop: Spacing.lg,
  },
});

export default PrivacyPolicyScreen;
