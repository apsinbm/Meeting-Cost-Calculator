import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Card, Button } from '../../components';
import { Colors, Spacing } from '../../constants';

/**
 * About Calculations Screen
 * Detailed information about cost calculations, limitations, and additional costs
 */
const AboutCalculationsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Button
          title="‹ Back"
          variant="secondary"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <AppText variant="h2">About Our Calculations</AppText>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* What's Included */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            What's Included
          </AppText>
          <Card>
            <AppText variant="body" style={styles.paragraph}>
              This app calculates employee costs based on:
            </AppText>
            <View style={styles.bulletList}>
              <BulletPoint text="Base annual salary" />
              <BulletPoint text="Annual bonus (if applicable)" />
              <BulletPoint text="Health insurance ($6,000/year default, editable per employee)" />
              <BulletPoint text="Payroll tax (10% of total compensation, capped at $1M per employee)" />
              <BulletPoint text="Employer pension match (5% of annual salary)" />
              <BulletPoint text="Social insurance ($37.65/week = $1,957.80/year per employee)" />
            </View>
          </Card>
        </View>

        {/* Important Limitations */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Important Limitations
          </AppText>
          <Card style={styles.warningCard}>
            <AppText variant="bodyLarge" style={styles.warningTitle}>
              This calculator does NOT include:
            </AppText>
            <View style={styles.bulletList}>
              <BulletPoint text="Fixed costs (office space, equipment, utilities)" />
              <BulletPoint text="Capital expenditure (CapEx) costs" />
              <BulletPoint text="Operational overhead costs" />
              <BulletPoint text="Work permit and immigration costs for non-Bermudians" />
              <BulletPoint text="Administrative and compliance costs" />
              <BulletPoint text="Vacation, sick leave, and statutory leave coverage" />
            </View>
          </Card>
        </View>

        {/* Actual Payroll Tax Details */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Actual Payroll Tax (Employer Portion)
          </AppText>
          <Card>
            <AppText variant="body" style={styles.paragraph}>
              Bermuda imposes a Payroll Tax on employers based on total remuneration. The employer is responsible for the full amount, though may deduct the employee's portion from wages.
            </AppText>
            <AppText variant="bodySmall" style={[styles.paragraph, { fontWeight: '600' }]}>
              This app uses the 10% rate for companies with total payroll over $1M (2025-26 rate). Your organization's rate may differ based on total company payroll.
            </AppText>
            <AppText variant="bodySmall" style={styles.paragraph}>
              Graduated employer rates for 1 April 2025 – 31 March 2026:
            </AppText>
            <View style={styles.bulletList}>
              <BulletPoint text="Annual payroll < $200,000 → 1.00%" small />
              <BulletPoint text="Payroll $200,000 - $350,000 → 2.50%" small />
              <BulletPoint text="Hotels & restaurants (≥ $350,000) → 5.00%" small />
              <BulletPoint text="Payroll $350,000 - $500,000 → 5.25%" small />
              <BulletPoint text="Retail (certain sectors) > $500,000 → 6.00%" small />
              <BulletPoint text="Payroll $500,000 - $1,000,000 → 7.50%" small />
              <BulletPoint text="Payroll > $1,000,000 → 10.00%" small />
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.paragraph}>
              Remuneration per employee is capped at BMD $1,000,000 per annum for payroll tax purposes.
            </AppText>
          </Card>
        </View>

        {/* Actual Social Insurance Details */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Actual Social Insurance
          </AppText>
          <Card>
            <AppText variant="body" style={styles.paragraph}>
              Bermuda social insurance uses a fixed weekly contribution (NOT percentage-based) under the Contributory Pensions Act 1970. This is split equally between employer and employee for standard employees under age 65.
            </AppText>
            <AppText variant="bodySmall" style={[styles.paragraph, { fontWeight: '600' }]}>
              This app uses the actual fixed cost of $37.65/week per employee (August 2025 rate).
            </AppText>
            <AppText variant="bodySmall" style={styles.paragraph}>
              Actual rates (as of August 2025):
            </AppText>
            <View style={styles.bulletList}>
              <BulletPoint text="Total weekly contribution: BMD $75.30" small />
              <BulletPoint text="Employer's share: BMD $37.65 per week" small />
              <BulletPoint text="Annual cost: BMD $1,957.80 (52 weeks)" small />
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.paragraph}>
              For employees aged 65+, the employee portion is dropped but employer still pays $37.65/week.
            </AppText>
          </Card>
        </View>

        {/* Employer Pension Match */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Employer Pension Match
          </AppText>
          <Card>
            <AppText variant="body" style={styles.paragraph}>
              Under the Occupational Pensions Act, employers must match employee pension contributions. The typical employer contribution rate is 5% of annual salary.
            </AppText>
            <AppText variant="bodySmall" style={[styles.paragraph, { fontWeight: '600' }]}>
              This app uses a 5% employer pension match rate.
            </AppText>
            <AppText variant="bodySmall" style={styles.paragraph}>
              Example for a $65,000 employee:
            </AppText>
            <View style={styles.bulletList}>
              <BulletPoint text="Employee contributes: $3,250/year (5%)" small />
              <BulletPoint text="Employer matches: $3,250/year (5%)" small />
              <BulletPoint text="Total pension contribution: $6,500/year" small />
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.paragraph}>
              The employer match percentage may vary by company policy, but 5% is standard practice in Bermuda.
            </AppText>
          </Card>
        </View>

        {/* Work Permits */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Work Permit / Immigration Costs
          </AppText>
          <Card>
            <AppText variant="body" style={styles.paragraph}>
              If the employee is not Bermudian (or otherwise exempt), employers may incur costs related to:
            </AppText>
            <View style={styles.bulletList}>
              <BulletPoint text="Work permit application and renewal fees" />
              <BulletPoint text="Visa processing" />
              <BulletPoint text="Immigration compliance" />
              <BulletPoint text="Legal and administrative expenses" />
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.paragraph}>
              These are not ongoing "per pay" costs but represent legal overhead for hiring foreign nationals.
            </AppText>
          </Card>
        </View>

        {/* Other Considerations */}
        <View style={styles.section}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Other Considerations
          </AppText>
          <Card>
            <AppText variant="bodyLarge" style={styles.subheading}>
              Administrative Burden
            </AppText>
            <View style={styles.bulletList}>
              <BulletPoint text="Compliance and reporting requirements" />
              <BulletPoint text="Potential fines for noncompliance or late remittance" />
              <BulletPoint text="Ongoing administrative overhead" />
            </View>

            <AppText variant="bodyLarge" style={[styles.subheading, { marginTop: Spacing.md }]}>
              Statutory Leave Entitlements
            </AppText>
            <AppText variant="body" style={styles.paragraph}>
              The Employment Act mandates vacation, sick leave, maternity, paternity, and other statutory leave. While not direct added costs in terms of contributions, employers must budget for paid leave and manage coverage/backfill.
            </AppText>
          </Card>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const BulletPoint = ({ text, small = false }) => (
  <View style={styles.bulletItem}>
    <View style={styles.bullet} />
    <AppText variant={small ? "caption" : "body"} style={styles.bulletText}>
      {text}
    </AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 80,
    marginBottom: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  paragraph: {
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  subheading: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  warningCard: {
    backgroundColor: Colors.warning + '10',
    borderColor: Colors.warning,
    borderWidth: 1,
  },
  warningTitle: {
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  disclaimerCard: {
    backgroundColor: Colors.gray100,
  },
  bulletList: {
    marginTop: Spacing.xs,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textPrimary,
    marginTop: 8,
    marginRight: Spacing.sm,
  },
  bulletText: {
    flex: 1,
    lineHeight: 20,
  },
});

export default AboutCalculationsScreen;
