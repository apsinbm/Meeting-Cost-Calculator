import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from './AppText';
import Button from './Button';
import Input from './Input';
import { Colors, Spacing } from '../constants';

/**
 * EditTextModal
 * Reusable modal for editing single text values
 */
const EditTextModal = ({
  visible,
  title,
  label,
  value,
  placeholder,
  keyboardType,
  onConfirm,
  onCancel,
  validation,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setInputValue(value || '');
      setError('');
    }
  }, [visible, value]);

  const handleConfirm = () => {
    // Validate if validation function provided
    if (validation) {
      const validationError = validation(inputValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    onConfirm(inputValue);
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <SafeAreaView edges={['bottom']}>
            {/* Header */}
            <View style={styles.header}>
              <AppText variant="h3">{title}</AppText>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <AppText variant="body" style={styles.label}>
                {label}
              </AppText>
              <Input
                value={inputValue}
                onChangeText={(text) => {
                  setInputValue(text);
                  setError('');
                }}
                placeholder={placeholder}
                keyboardType={keyboardType}
                error={error}
                autoFocus
              />
            </View>

            {/* Footer Buttons */}
            <View style={styles.footer}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={onCancel}
                style={{ flex: 1, marginRight: Spacing.sm }}
              />
              <Button
                title="Save"
                onPress={handleConfirm}
                style={{ flex: 1 }}
              />
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  label: {
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
});

export default EditTextModal;
