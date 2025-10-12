import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { TextStyles, Colors } from '../constants';

/**
 * AppText Component
 * Wrapper around Text with typography system support
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

  return (
    <RNText
      style={[
        textStyle,
        { color: textColor },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default AppText;
