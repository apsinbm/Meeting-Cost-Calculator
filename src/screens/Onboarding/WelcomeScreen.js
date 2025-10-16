import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, AppText } from '../../components';
import { Colors, Spacing } from '../../constants';
import { scaledFontSize, scaledSpacing, scaledImageDimensions, getMaxContentWidth } from '../../utils/iPadOptimization';

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
        {/* Meeting illustration */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/meeting-illustration.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Headline - wrapped for better text handling on iPad */}
        <View style={styles.headlineContainer}>
          <AppText variant="h1" style={styles.headline}>
            Track What Meetings Cost
          </AppText>
        </View>

        {/* Subheadline */}
        <AppText variant="body" color={Colors.textSecondary} style={styles.subheadline}>
          Calculate real-time employee costs to the company
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
    paddingHorizontal: scaledSpacing(Spacing.md),
    paddingTop: scaledSpacing(Spacing.lg),
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: getMaxContentWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: scaledSpacing(Spacing.lg),
    alignItems: 'center',
  },
  illustration: {
    ...scaledImageDimensions(220, 220),
  },
  headlineContainer: {
    width: '100%',
    marginBottom: scaledSpacing(Spacing.md),
    paddingHorizontal: scaledSpacing(Spacing.sm),
  },
  headline: {
    textAlign: 'center',
    fontSize: scaledFontSize(32),
    lineHeight: scaledFontSize(32) * 1.3,
  },
  subheadline: {
    textAlign: 'center',
    marginBottom: scaledSpacing(Spacing.xl),
    fontSize: scaledFontSize(16),
  },
  benefitsContainer: {
    width: '100%',
    marginTop: scaledSpacing(Spacing.lg),
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scaledSpacing(Spacing.md),
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: scaledSpacing(8),
    marginRight: scaledSpacing(Spacing.sm),
  },
  benefitText: {
    flex: 1,
    fontSize: scaledFontSize(16),
  },
  footer: {
    paddingHorizontal: scaledSpacing(Spacing.md),
    paddingBottom: scaledSpacing(Spacing.md),
    width: '100%',
    alignItems: 'center',
  },
  footerHint: {
    textAlign: 'center',
    marginTop: scaledSpacing(Spacing.sm),
    fontSize: scaledFontSize(12),
  },
});

export default WelcomeScreen;
