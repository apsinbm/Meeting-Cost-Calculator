import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from './AppText';
import Button from './Button';
import { Colors, Spacing } from '../constants';
import EmployeeCostCalculator from '../services/EmployeeCostCalculator';

/**
 * AttendeePickerModal
 * Modal for selecting employees attending a meeting
 */
const AttendeePickerModal = ({
  visible,
  employees,
  selectedEmployees = [],
  onConfirm,
  onCancel,
  onAddEmployee,
}) => {
  const [selected, setSelected] = useState([]);
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setSelected(selectedEmployees.map(emp => emp.id));
      flashAnim.setValue(0); // Reset animation
    }
  }, [visible, selectedEmployees]);

  const toggleEmployee = (employeeId) => {
    setSelected(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  const handleConfirm = () => {
    // Trigger red flash animation
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Call onConfirm after animation completes
      const selectedEmps = employees.filter(emp => selected.includes(emp.id));
      onConfirm(selectedEmps);
    });
  };

  const renderEmployee = ({ item }) => {
    const isSelected = selected.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.employeeItem, isSelected && styles.employeeItemSelected]}
        onPress={() => toggleEmployee(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.checkbox}>
          {isSelected && <View style={styles.checkboxChecked} />}
        </View>
        <View style={styles.employeeInfo}>
          <AppText variant="body" style={styles.employeeName}>
            {item.name}
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            {item.role} • {EmployeeCostCalculator.formatPerMinuteCost(item.perMinuteCost)}
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
              <AppText variant="h3">Select Attendees</AppText>
              <AppText variant="bodySmall" color={Colors.textSecondary}>
                {selected.length} selected
              </AppText>
            </View>

            {/* Employee List */}
            <FlatList
              data={employees}
              renderItem={renderEmployee}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <AppText variant="body" color={Colors.textSecondary}>
                    No employees available
                  </AppText>
                  <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: Spacing.sm }}>
                    Add employees to get started
                  </AppText>
                  {onAddEmployee && (
                    <Button
                      title="Add Employee"
                      onPress={onAddEmployee}
                      style={{ marginTop: Spacing.md }}
                    />
                  )}
                </View>
              }
              ListFooterComponent={
                employees.length > 0 && onAddEmployee ? (
                  <View style={styles.listFooter}>
                    <Button
                      title="+ Add Employee"
                      variant="secondary"
                      onPress={onAddEmployee}
                    />
                  </View>
                ) : null
              }
            />

            {/* Footer Buttons */}
            <View style={styles.footer}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={onCancel}
                style={{ flex: 1, marginRight: Spacing.sm }}
              />
              <Animated.View style={[
                { flex: 1 },
                {
                  backgroundColor: flashAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [Colors.primary, Colors.error]
                  }),
                  borderRadius: 8,
                }
              ]}>
                <Button
                  title="Start"
                  onPress={handleConfirm}
                  style={{ flex: 1, backgroundColor: 'transparent' }}
                  disabled={selected.length === 0}
                />
              </Animated.View>
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
  listFooter: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  employeeItemSelected: {
    backgroundColor: Colors.primaryLight + '10',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
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

export default AttendeePickerModal;
