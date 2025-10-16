/**
 * iPad Optimization Utility
 * Provides device-aware sizing for responsive design
 * iPhone sizes remain unchanged; iPad gets enhanced sizing
 */

import { Platform, Dimensions } from 'react-native';

const isIPad = Platform.isPad || (Platform.OS === 'ios' && Dimensions.get('window').width > 600);

/**
 * Scale spacing values for iPad
 * @param {number} baseValue - Base spacing value for iPhone
 * @returns {number} - Scaled value for iPad, or original for iPhone
 */
export const scaledSpacing = (baseValue) => {
  return isIPad ? baseValue * 1.5 : baseValue;
};

/**
 * Scale font sizes for iPad
 * @param {number} baseFontSize - Base font size for iPhone
 * @returns {number} - Scaled font size for iPad, or original for iPhone
 */
export const scaledFontSize = (baseFontSize) => {
  if (!isIPad) return baseFontSize;

  // Scale large fonts more aggressively for iPad (headline, title)
  if (baseFontSize >= 32) {
    return baseFontSize * 1.6;
  }
  // Scale medium fonts moderately
  if (baseFontSize >= 18) {
    return baseFontSize * 1.4;
  }
  // Scale small fonts slightly
  return baseFontSize * 1.2;
};

/**
 * Get iPad-optimized spacing value
 */
export const iPadSpacing = {
  xs: scaledSpacing(4),
  sm: scaledSpacing(8),
  md: scaledSpacing(16),
  lg: scaledSpacing(24),
  xl: scaledSpacing(32),
  xxl: scaledSpacing(48),
  xxxl: scaledSpacing(64),
};

/**
 * Get iPad-optimized font sizes
 */
export const iPadFontSizes = {
  xs: scaledFontSize(12),
  sm: scaledFontSize(14),
  md: scaledFontSize(16),
  lg: scaledFontSize(18),
  xl: scaledFontSize(20),
  xxl: scaledFontSize(24),
  xxxl: scaledFontSize(32),
  huge: scaledFontSize(56),
};

/**
 * Get iPad-optimized image dimensions
 * @param {number} baseWidth - Base width for iPhone
 * @param {number} baseHeight - Base height for iPhone
 * @returns {object} - { width, height } scaled for iPad
 */
export const scaledImageDimensions = (baseWidth, baseHeight) => {
  if (!isIPad) {
    return { width: baseWidth, height: baseHeight };
  }
  return {
    width: baseWidth * 1.4,
    height: baseHeight * 1.4,
  };
};

/**
 * Get max content width for iPad (for centering)
 * Prevents text from stretching too wide on large screens
 */
export const getMaxContentWidth = () => {
  if (!isIPad) {
    return '100%';
  }
  // iPad screens are usually 768px or wider; limit to reasonable width
  return 600;
};

/**
 * Check if device is iPad
 */
export const getIsIPad = () => isIPad;

export default {
  scaledSpacing,
  scaledFontSize,
  iPadSpacing,
  iPadFontSizes,
  scaledImageDimensions,
  getMaxContentWidth,
  getIsIPad,
};
