import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <Pressable style={styles.modalOverlay} onPress={onCancel}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
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
