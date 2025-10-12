import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '../constants';

/**
 * Input Component
 * Text input with label, error state, and validation support
 */
const Input = ({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  style,
  inputStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          multiline && styles.inputMultiline,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray400}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputMultiline: {
    height: 96,
    paddingTop: Spacing.sm,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});

export default Input;
