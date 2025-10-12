import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Spacing, TextStyles } from '../constants';

/**
 * Button Component
 * Supports primary/secondary variants, disabled state, loading state
 */
const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary'
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props
}) => {
  const isPrimary = variant === 'primary';

  const getBackgroundColor = () => {
    if (disabled) return Colors.gray300;
    return isPrimary ? Colors.primary : Colors.secondary;
  };

  const getTextColor = () => {
    if (disabled) return Colors.gray500;
    return Colors.textInverse;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            { color: getTextColor() },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    ...TextStyles.button,
    textAlign: 'center',
  },
});

export default Button;
