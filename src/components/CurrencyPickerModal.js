import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from './AppText';
import Button from './Button';
import { Colors, Spacing } from '../constants';
import CompanyService from '../services/CompanyService';

/**
 * CurrencyPickerModal
 * Modal for selecting currency
 */
const CurrencyPickerModal = ({
  visible,
  selectedCurrency,
  onConfirm,
  onCancel,
}) => {
  const [selected, setSelected] = useState('BMD');
  const currencies = CompanyService.getSupportedCurrencies();

  useEffect(() => {
    if (visible) {
      setSelected(selectedCurrency || 'BMD');
    }
  }, [visible, selectedCurrency]);

  const handleConfirm = () => {
    const currency = CompanyService.getCurrency(selected);
    onConfirm(selected, currency);
  };

  const renderCurrency = ({ item }) => {
    const isSelected = selected === item.code;

    return (
      <TouchableOpacity
        style={[styles.currencyItem, isSelected && styles.currencyItemSelected]}
        onPress={() => setSelected(item.code)}
        activeOpacity={0.7}
      >
        <View style={styles.radioButton}>
          {isSelected && <View style={styles.radioButtonSelected} />}
        </View>
        <View style={styles.currencyInfo}>
          <AppText variant="body" style={styles.currencyName}>
            {item.name}
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            Symbol: {item.symbol}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <Pressable style={styles.modalOverlay} onPress={onCancel}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
              <AppText variant="h3">Select Currency</AppText>
            </View>

            {/* Currency List */}
            <FlatList
              data={currencies}
              renderItem={renderCurrency}
              keyExtractor={(item) => item.code}
              contentContainerStyle={styles.list}
            />

            {/* Footer Buttons */}
            <View style={styles.footer}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={onCancel}
                style={{ flex: 1, marginRight: Spacing.sm }}
              />
              <Button
                title="Confirm"
                onPress={handleConfirm}
                style={{ flex: 1 }}
              />
            </View>
          </SafeAreaView>
        </Pressable>
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
    flex: 1,
    marginTop: 60,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  list: {
    paddingVertical: Spacing.sm,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  currencyItemSelected: {
    backgroundColor: Colors.primaryLight + '10',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyName: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
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

export default CurrencyPickerModal;
