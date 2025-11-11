import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { TextStyles, Colors } from '../constants';

/**
 * AppText Component
 * Wrapper around Text with typography system support
 * Disables font scaling for critical UI elements to maintain layout consistency
 */
const AppText = ({
  children,
  variant = 'body', // 'h1' | 'h2' | 'h3' | 'body' | 'bodyLarge' | 'bodySmall' | 'caption' | 'button' | 'costDisplay'
  color,
  style,
  ...props
}) => {
  const textStyle = TextStyles[variant] || TextStyles.body;
  const textColor = color || Colors.textPrimary;

  // Disable font scaling for critical UI elements to prevent user accessibility settings
  // from breaking layout (e.g., cost display, timers, headings)
  const disableFontScaling = ['h1', 'h2', 'h3', 'costDisplay', 'button'].includes(variant);

  return (
    <RNText
      style={[
        textStyle,
        { color: textColor },
        style,
      ]}
      allowFontScaling={!disableFontScaling}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default AppText;
