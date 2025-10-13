import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, AppText } from '../../components';
import { Colors, Spacing } from '../../constants';

/**
 * Welcome Screen
 * First screen users see - explains value proposition
 */
const WelcomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setLoading(true);
      // Go directly to main app - let the Today screen handle employee creation
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error navigating:', error);
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
          Track What Meetings Really Cost
        </AppText>

        {/* Subheadline */}
        <AppText variant="body" color={Colors.textSecondary} style={styles.subheadline}>
          Calculate real-time costs including salary, bonuses, and Bermuda employment expenses
        </AppText>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <BenefitItem text="Start tracking meetings immediately" />
          <BenefitItem text="Complete privacy - data never leaves device" />
          <BenefitItem text="Accurate costs with true employment expenses" />
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <Button
          title="Start Tracking"
          onPress={handleContinue}
          loading={loading}
        />
        <AppText variant="caption" color={Colors.textSecondary} style={styles.footerHint}>
          Add employees, then start your first meeting
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
