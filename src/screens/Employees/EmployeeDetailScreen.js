import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Card, Button } from '../../components';
import { Colors, Spacing } from '../../constants';
import EmployeeService from '../../services/EmployeeService';
import EmployeeCostCalculator from '../../services/EmployeeCostCalculator';

/**
 * Employee Detail Screen
 * Shows complete employee information and cost breakdown
 */
const EmployeeDetailScreen = ({ route, navigation }) => {
  const { employeeId } = route.params;
  const [employee, setEmployee] = useState(null);
  const [costBreakdown, setCostBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployee();
  }, [employeeId]);

  const loadEmployee = async () => {
    try {
      const emp = await EmployeeService.getEmployeeById(employeeId);
      if (emp) {
        setEmployee(emp);
        const breakdown = EmployeeCostCalculator.calculateEmployeeCost(emp);
        setCostBreakdown(breakdown);
      } else {
        Alert.alert('Error', 'Employee not found.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Error loading employee:', error);
      Alert.alert('Error', 'Failed to load employee details. Please try again.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Employee',
      `Are you sure you want to delete ${employee.name}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await EmployeeService.deleteEmployee(employeeId);
            if (result.success) {
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  if (loading || !employee) {
    return (
      <SafeAreaView style={styles.container}>
        <AppText>Loading...</AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AppText variant="body" color={Colors.primary} style={styles.backButtonText}>
            ‹ Back
          </AppText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Employee Info */}
        <Card>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <AppText variant="h1" color={Colors.primary}>
                {employee.name.charAt(0).toUpperCase()}
              </AppText>
            </View>
          </View>
          <AppText variant="h2" style={styles.name}>
            {employee.name}
          </AppText>
          <AppText variant="body" color={Colors.textSecondary} style={styles.role}>
            {employee.role}
          </AppText>
          <AppText variant="bodySmall" color={Colors.textSecondary} style={styles.email}>
            {employee.email}
          </AppText>
        </Card>

        {/* Cost Summary */}
        <Card style={{ marginTop: Spacing.md }}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Cost Summary
          </AppText>
          <View style={styles.costRow}>
            <AppText variant="body">Per-Minute Cost</AppText>
            <AppText variant="h3" color={Colors.primary}>
              {EmployeeCostCalculator.formatPerMinuteCost(employee.perMinuteCost)}
            </AppText>
          </View>
          <View style={styles.costRow}>
            <AppText variant="body">Hourly Cost</AppText>
            <AppText variant="bodyLarge" color={Colors.textPrimary}>
              {EmployeeCostCalculator.formatHourlyCost(employee.hourlyCost)}
            </AppText>
          </View>
          <View style={[styles.costRow, styles.totalRow]}>
            <AppText variant="body">Annual Cost</AppText>
            <AppText variant="bodyLarge" color={Colors.textPrimary}>
              {EmployeeCostCalculator.formatCurrency(employee.totalAnnualCost)}
            </AppText>
          </View>
        </Card>

        {/* Cost Breakdown */}
        {costBreakdown && (
          <Card style={{ marginTop: Spacing.md }}>
            <AppText variant="h3" style={styles.sectionTitle}>
              Cost Breakdown
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{ marginBottom: Spacing.md }}>
              Based on Bermuda employment costs
            </AppText>

            <View style={styles.breakdownRow}>
              <AppText variant="body">Base Salary</AppText>
              <AppText variant="body">
                {EmployeeCostCalculator.formatCurrency(costBreakdown.annualSalary)}
              </AppText>
            </View>

            {costBreakdown.annualBonus > 0 && (
              <View style={styles.breakdownRow}>
                <AppText variant="body">Annual Bonus</AppText>
                <AppText variant="body">
                  {EmployeeCostCalculator.formatCurrency(costBreakdown.annualBonus)}
                </AppText>
              </View>
            )}

            <View style={styles.breakdownRow}>
              <AppText variant="bodySmall" color={Colors.textSecondary}>
                Total Compensation
              </AppText>
              <AppText variant="bodySmall" color={Colors.textSecondary}>
                {EmployeeCostCalculator.formatCurrency(costBreakdown.totalCompensation)}
              </AppText>
            </View>

            <AppText variant="bodySmall" color={Colors.textSecondary} style={{ marginTop: Spacing.md, marginBottom: Spacing.sm }}>
              Annual Employer Costs
            </AppText>

            <View style={styles.breakdownRow}>
              <AppText variant="body">Health Insurance</AppText>
              <AppText variant="body">
                {EmployeeCostCalculator.formatCurrency(costBreakdown.healthInsuranceCost)}
              </AppText>
            </View>

            <View style={styles.breakdownRow}>
              <AppText variant="body">
                Payroll Tax ({costBreakdown.payrollTaxRate}%)
              </AppText>
              <AppText variant="body">
                {EmployeeCostCalculator.formatCurrency(costBreakdown.payrollTax)}
              </AppText>
            </View>

            <View style={styles.breakdownRow}>
              <AppText variant="body">
                Employer Pension ({costBreakdown.employerPensionRate}%)
              </AppText>
              <AppText variant="body">
                {EmployeeCostCalculator.formatCurrency(costBreakdown.employerPension)}
              </AppText>
            </View>

            <View style={styles.breakdownRow}>
              <AppText variant="body">Social Insurance</AppText>
              <AppText variant="body">
                {EmployeeCostCalculator.formatCurrency(costBreakdown.socialInsurance)}
              </AppText>
            </View>

            <View style={[styles.breakdownRow, styles.totalRow]}>
              <AppText variant="h3">Total Annual Cost</AppText>
              <AppText variant="h3" color={Colors.primary}>
                {EmployeeCostCalculator.formatCurrency(costBreakdown.totalAnnualCost)}
              </AppText>
            </View>
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Edit Employee"
            onPress={() => navigation.navigate('AddEmployee', { employee })}
            style={{ marginBottom: Spacing.md }}
          />
          <Button
            title="Delete Employee"
            variant="secondary"
            onPress={handleDelete}
          />
        </View>
      </ScrollView>
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
  },
  backButton: {
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
    marginLeft: -Spacing.xs,
  },
  backButtonText: {
    fontSize: 17,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  role: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  email: {
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  breakdownRow: {
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
  actions: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
});

export default EmployeeDetailScreen;
