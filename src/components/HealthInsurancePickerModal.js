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
import { BermudaDefaults } from '../constants';
import EmployeeCostCalculator from '../services/EmployeeCostCalculator';

/**
 * HealthInsurancePickerModal
 * Modal for selecting health insurance plan from 8 options
 * Each plan has different coverage and cost
 */
const HealthInsurancePickerModal = ({
  visible,
  selectedPlan,
  onConfirm,
  onCancel,
}) => {
  const [selected, setSelected] = useState('Employee only');
  const plans = BermudaDefaults.healthInsurancePlans;

  useEffect(() => {
    if (visible) {
      setSelected(selectedPlan || 'Employee only');
    }
  }, [visible, selectedPlan]);

  const handleConfirm = () => {
    const planData = plans.find(p => p.name === selected);
    onConfirm(selected, planData);
  };

  const renderPlan = ({ item }) => {
    const isSelected = selected === item.name;

    return (
      <TouchableOpacity
        style={[styles.planItem, isSelected && styles.planItemSelected]}
        onPress={() => setSelected(item.name)}
        activeOpacity={0.7}
      >
        <View style={styles.radioButton}>
          {isSelected && <View style={styles.radioButtonSelected} />}
        </View>
        <View style={styles.planInfo}>
          <AppText variant="body" style={styles.planName}>
            {item.name}
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            {EmployeeCostCalculator.formatCurrency(item.monthly)}/mo ({EmployeeCostCalculator.formatCurrency(item.annual)}/year)
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
              <AppText variant="h3">Select Health Insurance Plan</AppText>
            </View>

            {/* Plan List */}
            <FlatList
              data={plans}
              renderItem={renderPlan}
              keyExtractor={(item) => item.name}
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
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  planItemSelected: {
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
  planInfo: {
    flex: 1,
  },
  planName: {
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

export default HealthInsurancePickerModal;
