// Design System - Typography
// Consistent text styles for professional appearance

import { Platform } from 'react-native';

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 56,  // For active meeting cost display
};

export const FontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const LineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
};

// Platform-specific font families
export const FontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
};

// Pre-defined text styles for common use cases
export const TextStyles = {
  h1: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.xxxl * LineHeights.tight,
  },
  h2: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.xxl * LineHeights.tight,
  },
  h3: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.xl * LineHeights.normal,
  },
  body: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.md * LineHeights.normal,
  },
  bodyLarge: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.lg * LineHeights.normal,
  },
  bodySmall: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.sm * LineHeights.normal,
  },
  caption: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.xs * LineHeights.normal,
  },
  button: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.md * LineHeights.tight,
  },
  // Special style for active meeting cost display
  costDisplay: {
    fontSize: FontSizes.huge,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.huge * LineHeights.tight,
  },
};

export default {
  FontSizes,
  FontWeights,
  LineHeights,
  FontFamily,
  TextStyles,
};
