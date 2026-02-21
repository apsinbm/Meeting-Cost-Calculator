import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';
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
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Show illustration first, then fade in text content after a delay
    const timer = setTimeout(() => {
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.scrollContent}>
        {/* Meeting illustration */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/meeting-illustration.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Headline - wrapped for better text handling on iPad */}
        <Animated.View style={[styles.headlineContainer, { opacity: contentOpacity }]}>
          <AppText variant="h1" style={styles.headline}>
            Track What Meetings Cost
          </AppText>
        </Animated.View>

        {/* Subheadline */}
        <Animated.View style={{ opacity: contentOpacity }}>
          <AppText variant="body" color={Colors.textSecondary} style={styles.subheadline}>
            Calculate real-time employee costs to the company
          </AppText>
        </Animated.View>

        {/* Benefits */}
        <Animated.View style={[styles.benefitsContainer, { opacity: contentOpacity }]}>
          <BenefitItem text="Start tracking meetings immediately" />
          <BenefitItem text="Complete privacy - data never leaves device" />
          <BenefitItem text="Accurate costs with true employment expenses" />
        </Animated.View>

        {/* Motivational Quote */}
        <Animated.View style={{ opacity: contentOpacity }}>
          <AppText variant="body" color={Colors.textSecondary} style={styles.quote}>
            "The most efficient meeting is often the one that never takes place."
          </AppText>
        </Animated.View>
      </View>

      {/* Continue Button */}
      <Animated.View style={[styles.footer, { opacity: contentOpacity }]}>
        <Button
          title="Start Tracking"
          onPress={handleContinue}
          loading={loading}
        />
        <AppText variant="caption" color={Colors.textSecondary} style={styles.footerHint}>
          Add employees, then start your first meeting
        </AppText>
      </Animated.View>
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
  scrollContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: getMaxContentWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  illustration: {
    width: 180,
    height: 180,
  },
  headlineContainer: {
    width: '100%',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  headline: {
    textAlign: 'center',
    fontSize: scaledFontSize(24),
    lineHeight: scaledFontSize(29),
    fontWeight: '700',
  },
  subheadline: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
    fontSize: scaledFontSize(13),
    lineHeight: scaledFontSize(18),
    paddingHorizontal: Spacing.sm,
  },
  benefitsContainer: {
    width: '100%',
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xs,
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
    marginTop: 7,
    marginRight: Spacing.sm,
    flexShrink: 0,
  },
  benefitText: {
    flex: 1,
    fontSize: scaledFontSize(13),
    lineHeight: scaledFontSize(18),
  },
  quote: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
    fontSize: scaledFontSize(14),
    lineHeight: scaledFontSize(19),
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  footerHint: {
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontSize: 12,
  },
});

export default WelcomeScreen;
