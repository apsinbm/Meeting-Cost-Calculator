import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, AppText } from '../../components';
import { Colors, Spacing } from '../../constants';
import EmployeeService from '../../services/EmployeeService';

/**
 * Welcome Screen
 * First screen users see - explains value proposition
 */
const WelcomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setLoading(true);

      // Check if user has any employees
      const employees = await EmployeeService.getEmployees();

      if (employees.length === 0) {
        // First-time user - guide them to add their first employee
        navigation.navigate('AddEmployee', {
          isFirstEmployee: true,
          onEmployeeAdded: () => {
            // After adding first employee, go to main app
            navigation.navigate('Main');
          },
        });
      } else {
        // User has employees, go to main app
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('Error checking employees:', error);
      // On error, just go to main app
      navigation.navigate('Main');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo placeholder */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder} />
        </View>

        {/* Headline */}
        <AppText variant="h1" style={styles.headline}>
          Know The True Cost of Meetings
        </AppText>

        {/* Subheadline */}
        <AppText variant="body" color={Colors.textSecondary} style={styles.subheadline}>
          Comprehensive employee cost tracking including salary, bonuses, and Bermuda employment expenses
        </AppText>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <BenefitItem text="Complete privacy - data never leaves device" />
          <BenefitItem text="Accurate cost calculations with true employment costs" />
          <BenefitItem text="Pre-calculate and track meetings in real-time" />
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={handleContinue}
          loading={loading}
        />
        <AppText variant="caption" color={Colors.textSecondary} style={styles.footerHint}>
          Next: Add your first employee
        </AppText>
      </View>
    </SafeAreaView>
  );
};

const BenefitItem = ({ text }) => (
  <View style={styles.benefitItem}>
    <View style={styles.bullet} />
    <AppText variant="body" style={styles.benefitText}>
      {text}
    </AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xxl,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: Spacing.xl,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
  },
  headline: {
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subheadline: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  benefitsContainer: {
    width: '100%',
    marginTop: Spacing.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 8,
    marginRight: Spacing.sm,
  },
  benefitText: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  footerHint: {
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});

export default WelcomeScreen;
