import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '../constants';

/**
 * Card Component
 * Container with shadow, rounded corners, and padding
 * Can be pressable or static
 */
const Card = ({
  children,
  onPress,
  style,
  borderColor,
  ...props
}) => {
  const cardStyle = [
    styles.card,
    borderColor && { borderLeftWidth: 4, borderLeftColor: borderColor },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});

export default Card;
