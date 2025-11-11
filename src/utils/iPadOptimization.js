/**
 * Device Optimization Utility
 * Provides device-aware sizing for responsive design
 * Handles both iPhone and iPad screen sizes for optimal layout
 */

import { Platform, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Determine device type
const isIPad = Platform.isPad || (Platform.OS === 'ios' && screenWidth > 600);

// iPhone screen size categories
const isSmallPhone = Platform.OS === 'ios' && !isIPad && screenWidth < 375; // iPhone SE, older models
const isMediumPhone = Platform.OS === 'ios' && !isIPad && screenWidth >= 375 && screenWidth <= 414; // iPhone 13, 14
const isLargePhone = Platform.OS === 'ios' && !isIPad && screenWidth > 414; // iPhone Pro Max

/**
 * Get device scaling factor for responsive design
 * Returns multiplier based on screen size
 */
export const getDeviceScaleFactor = () => {
  if (isIPad) return 1.5;
  if (isSmallPhone) return 0.9; // Small iPhones get slightly reduced sizes
  if (isLargePhone) return 1.1; // Large iPhones get slightly increased sizes
  return 1.0; // Medium iPhones stay at base size
};

/**
 * Scale spacing values based on device type
 * @param {number} baseValue - Base spacing value
 * @returns {number} - Scaled value for device
 */
export const scaledSpacing = (baseValue) => {
  const scaleFactor = getDeviceScaleFactor();
  return baseValue * scaleFactor;
};

/**
 * Scale font sizes based on device type
 * Responsive scaling for different iPhone models and iPad
 * @param {number} baseFontSize - Base font size
 * @returns {number} - Scaled font size for device
 */
export const scaledFontSize = (baseFontSize) => {
  if (isIPad) {
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
  }

  // iPhone scaling based on screen size
  if (isSmallPhone) {
    // Small phones: reduce large fonts more, keep small fonts closer to base
    if (baseFontSize >= 32) {
      return baseFontSize * 0.85;
    }
    if (baseFontSize >= 20) {
      return baseFontSize * 0.9;
    }
    return baseFontSize * 0.95;
  }

  if (isLargePhone) {
    // Large phones: increase slightly for better readability
    if (baseFontSize >= 32) {
      return baseFontSize * 1.15;
    }
    if (baseFontSize >= 20) {
      return baseFontSize * 1.1;
    }
    return baseFontSize * 1.05;
  }

  // Medium phones: return base size
  return baseFontSize;
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
 * Get device-optimized image dimensions
 * Responsive scaling for different device sizes
 * @param {number} baseWidth - Base width for medium iPhone
 * @param {number} baseHeight - Base height for medium iPhone
 * @returns {object} - { width, height } scaled for device
 */
export const scaledImageDimensions = (baseWidth, baseHeight) => {
  const scaleFactor = getDeviceScaleFactor();
  return {
    width: baseWidth * scaleFactor,
    height: baseHeight * scaleFactor,
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

/**
 * Check if device is a small iPhone (SE, older models)
 */
export const getIsSmallPhone = () => isSmallPhone;

/**
 * Check if device is a medium iPhone (13, 14)
 */
export const getIsMediumPhone = () => isMediumPhone;

/**
 * Check if device is a large iPhone (Pro Max)
 */
export const getIsLargePhone = () => isLargePhone;

export default {
  scaledSpacing,
  scaledFontSize,
  iPadSpacing,
  iPadFontSizes,
  scaledImageDimensions,
  getMaxContentWidth,
  getIsIPad,
  getIsSmallPhone,
  getIsMediumPhone,
  getIsLargePhone,
  getDeviceScaleFactor,
};
