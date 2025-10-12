// Design System - Spacing
// 8px grid system for consistent spacing throughout the app

export const Spacing = {
  xs: 4,      // Extra small - tight spacing
  sm: 8,      // Small - minimal spacing
  md: 16,     // Medium - standard spacing
  lg: 24,     // Large - comfortable spacing
  xl: 32,     // Extra large - generous spacing
  xxl: 48,    // Extra extra large - section spacing
  xxxl: 64,   // Extra extra extra large - major sections
};

// Semantic spacing names for specific use cases
export const ComponentSpacing = {
  cardPadding: Spacing.md,
  cardMargin: Spacing.sm,
  screenPadding: Spacing.md,
  sectionMargin: Spacing.xl,
  elementMargin: Spacing.md,
  inputPadding: Spacing.sm,
  buttonPadding: Spacing.md,
};

export default Spacing;
