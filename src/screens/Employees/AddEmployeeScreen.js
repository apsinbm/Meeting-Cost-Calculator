import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, AppText, Card, HealthInsurancePickerModal } from '../../components';
import { Colors, Spacing } from '../../constants';
import { BermudaDefaults } from '../../constants';
import EmployeeService from '../../services/EmployeeService';
import EmployeeCostCalculator from '../../services/EmployeeCostCalculator';
import ValidationService from '../../services/ValidationService';

/**
 * Add Employee Screen
 * Single-screen form with live cost preview
 */
const AddEmployeeScreen = ({ navigation, route }) => {
  const isEditing = route.params?.employee;
  const existingEmployee = route.params?.employee;
  const isFirstEmployee = route.params?.isFirstEmployee;

  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState({
    name: existingEmployee?.name || '',
    role: existingEmployee?.role || '',
    email: existingEmployee?.email || '',
    annualSalary: existingEmployee?.annualSalary?.toString() || '',
    annualBonus: existingEmployee?.annualBonus?.toString() || '',
    healthInsurancePlan: existingEmployee?.healthInsurancePlan || BermudaDefaults.defaultHealthInsurancePlan,
    healthInsuranceMonthly: existingEmployee?.healthInsuranceMonthly || BermudaDefaults.defaultHealthInsuranceMonthly,
    healthInsuranceAnnual: existingEmployee?.healthInsuranceAnnual || BermudaDefaults.defaultHealthInsuranceAnnual,
  });
  const [errors, setErrors] = useState({});
  const [costBreakdown, setCostBreakdown] = useState(null);
  const [showHealthInsuranceModal, setShowHealthInsuranceModal] = useState(false);

  // Calculate costs whenever inputs change
  useEffect(() => {
    if (employee.annualSalary) {
      try {
        const employeeData = {
          ...employee,
          annualSalary: parseFloat(String(employee.annualSalary).replace(/,/g, '')) || 0,
          annualBonus: parseFloat(String(employee.annualBonus).replace(/,/g, '')) || 0,
          healthInsuranceAnnual: parseFloat(employee.healthInsuranceAnnual) || BermudaDefaults.defaultHealthInsuranceAnnual,
        };
        const costs = EmployeeCostCalculator.calculateEmployeeCost(employeeData);
        setCostBreakdown(costs);
      } catch (error) {
        setCostBreakdown(null);
      }
    } else {
      setCostBreakdown(null);
    }
  }, [employee.annualSalary, employee.annualBonus, employee.healthInsuranceAnnual, employee.healthInsurancePlan]);

  const updateField = (field, value) => {
    setEmployee(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const nameValidation = ValidationService.validateName(employee.name);
    if (!nameValidation.valid) newErrors.name = nameValidation.error;

    // Role is now optional
    if (employee.role) {
      const roleValidation = ValidationService.validateRole(employee.role);
      if (!roleValidation.valid) newErrors.role = roleValidation.error;
    }

    const salaryValidation = ValidationService.validateSalary(employee.annualSalary);
    if (!salaryValidation.valid) newErrors.annualSalary = salaryValidation.error;

    if (employee.annualBonus) {
      const bonusValidation = ValidationService.validateBonus(employee.annualBonus);
      if (!bonusValidation.valid) newErrors.annualBonus = bonusValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = isEditing
        ? await EmployeeService.updateEmployee(existingEmployee.id, employee)
        : await EmployeeService.addEmployee(employee);

      if (result.success) {
        // Call the onEmployeeAdded callback if provided (e.g., from attendee picker flow)
        if (route.params?.onEmployeeAdded) {
          route.params.onEmployeeAdded();
        }

        Alert.alert(
          'Success',
          isEditing ? 'Employee updated successfully' : 'Employee added successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        setErrors(result.errors || {});
        if (result.errors?.general) {
          Alert.alert('Error', result.errors.general);
        }
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      Alert.alert('Error', 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          {!isFirstEmployee && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.6}
            >
              <AppText variant="body" color={Colors.primary} style={styles.backButtonText}>‹ Back</AppText>
            </TouchableOpacity>
          )}
          <AppText variant="h2">{isEditing ? 'Edit Employee' : (isFirstEmployee ? 'Add Your First Employee' : 'Add Employee')}</AppText>
          {isFirstEmployee && (
            <AppText variant="bodySmall" color={Colors.textSecondary} style={{ marginTop: Spacing.xs }}>
              Start by adding employee information to calculate meeting costs
            </AppText>
          )}
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Basic Information Section */}
          <View style={styles.section}>
            <AppText variant="h3" style={styles.sectionTitle}>
              Basic Information
            </AppText>

            <Input
              label="Full Name *"
              value={employee.name}
              onChangeText={(value) => updateField('name', value)}
              error={errors.name}
              placeholder="Sarah Chen"
              autoCapitalize="words"
            />

            <Input
              label="Role or Title (optional)"
              value={employee.role}
              onChangeText={(value) => updateField('role', value)}
              error={errors.role}
              placeholder="Manager"
              autoCapitalize="words"
            />
          </View>

          {/* Compensation Section */}
          <View style={styles.section}>
            <AppText variant="h3" style={styles.sectionTitle}>
              Compensation
            </AppText>

            <Input
              label="Annual Base Salary *"
              value={employee.annualSalary}
              onChangeText={(value) => updateField('annualSalary', value)}
              error={errors.annualSalary}
              placeholder="80000"
              keyboardType="numeric"
            />

            <Input
              label="Annual Bonus (optional)"
              value={employee.annualBonus}
              onChangeText={(value) => updateField('annualBonus', value)}
              error={errors.annualBonus}
              placeholder="10000"
              keyboardType="numeric"
            />

            <AppText variant="caption" color={Colors.textSecondary} style={styles.hint}>
              Enter total annual amounts before taxes
            </AppText>
          </View>

          {/* Benefits Section */}
          <View style={styles.section}>
            <AppText variant="h3" style={styles.sectionTitle}>
              Benefits
            </AppText>

            <AppText variant="bodySmall" color={Colors.textSecondary} style={styles.inputLabel}>
              Health Insurance Plan *
            </AppText>
            <TouchableOpacity
              style={styles.planPickerButton}
              onPress={() => setShowHealthInsuranceModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.planPickerContent}>
                <View>
                  <AppText variant="body" style={styles.planPickerText}>
                    {employee.healthInsurancePlan}
                  </AppText>
                  <AppText variant="caption" color={Colors.textSecondary}>
                    {EmployeeCostCalculator.formatCurrency(employee.healthInsuranceMonthly)}/month
                    ({EmployeeCostCalculator.formatCurrency(employee.healthInsuranceAnnual)}/year)
                  </AppText>
                </View>
                <AppText variant="body" color={Colors.primary} style={styles.planPickerArrow}>
                  ›
                </AppText>
              </View>
            </TouchableOpacity>

            <AppText variant="caption" color={Colors.textSecondary} style={styles.hint}>
              Select the employee's health insurance plan. Costs are included in meeting calculations.
            </AppText>
          </View>

          {/* Live Cost Preview */}
          {costBreakdown && (
            <View style={styles.section}>
              <AppText variant="h3" style={styles.sectionTitle}>
                Calculated Costs
              </AppText>

              <Card style={styles.costCard}>
                <View style={styles.costRow}>
                  <AppText variant="body">Per-Minute Cost</AppText>
                  <AppText variant="h3" color={Colors.primary}>
                    {EmployeeCostCalculator.formatPerMinuteCost(costBreakdown.perMinuteCost)}
                  </AppText>
                </View>
                <View style={styles.costRow}>
                  <AppText variant="body">Hourly Cost</AppText>
                  <AppText variant="bodyLarge">
                    {EmployeeCostCalculator.formatHourlyCost(costBreakdown.hourlyCost)}
                  </AppText>
                </View>
                <View style={[styles.costRow, styles.totalRow]}>
                  <AppText variant="body">Annual Cost</AppText>
                  <AppText variant="bodyLarge">
                    {EmployeeCostCalculator.formatCurrency(costBreakdown.totalAnnualCost)}
                  </AppText>
                </View>
              </Card>

              <AppText variant="caption" color={Colors.textSecondary} style={styles.hint}>
                Based on Bermuda employment costs: salary + bonus + health insurance + payroll tax (10%) + employer pension (5%) + social insurance ($1,957.80 annual)
              </AppText>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          <Button
            title={isEditing ? 'Update Employee' : 'Save Employee'}
            onPress={handleSave}
            loading={loading}
          />
        </View>

        {/* Health Insurance Plan Picker Modal */}
        <HealthInsurancePickerModal
          visible={showHealthInsuranceModal}
          selectedPlan={employee.healthInsurancePlan}
          onConfirm={(planName, planData) => {
            setEmployee(prev => ({
              ...prev,
              healthInsurancePlan: planName,
              healthInsuranceMonthly: planData.monthly,
              healthInsuranceAnnual: planData.annual,
            }));
            setShowHealthInsuranceModal(false);
          }}
          onCancel={() => setShowHealthInsuranceModal(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    marginLeft: -Spacing.xs,
  },
  backButtonText: {
    fontSize: 14,  // reduced from 17
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  hint: {
    marginTop: Spacing.xs,
  },
  benefitCard: {
    marginTop: Spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  benefitInfo: {
    flex: 1,
  },
  costCard: {
    backgroundColor: Colors.primaryLight + '10',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  totalRow: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputLabel: {
    marginBottom: Spacing.xs,
  },
  planPickerButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.background,
  },
  planPickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planPickerText: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  planPickerArrow: {
    fontSize: 20,
  },
});

export default AddEmployeeScreen;
