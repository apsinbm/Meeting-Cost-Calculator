import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AppText, Card, Input, Button } from '../../components';
import { Colors, Spacing } from '../../constants';
import EmployeeService from '../../services/EmployeeService';
import EmployeeCostCalculator from '../../services/EmployeeCostCalculator';

/**
 * Employee List Screen
 * Displays all employees with search functionality
 */
const EmployeeListScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await EmployeeService.getEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
      Alert.alert('Error', 'Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEmployees();
    }, [])
  );

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(lowerQuery) ||
        emp.role.toLowerCase().includes(lowerQuery) ||
        emp.email.toLowerCase().includes(lowerQuery)
    );

    setFilteredEmployees(filtered);
  };

  const handleDelete = (employee) => {
    Alert.alert(
      'Delete Employee',
      `Are you sure you want to delete ${employee.name}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await EmployeeService.deleteEmployee(employee.id);
            if (result.success) {
              loadEmployees();
            }
          },
        },
      ]
    );
  };

  const renderEmployee = ({ item }) => (
    <Card
      onPress={() => navigation.navigate('EmployeeDetail', { employeeId: item.id })}
      style={styles.employeeCard}
    >
      <View style={styles.employeeHeader}>
        <View style={styles.employeeAvatar}>
          <AppText variant="h3" color={Colors.primary}>
            {item.name.charAt(0).toUpperCase()}
          </AppText>
        </View>
        <View style={styles.employeeInfo}>
          <AppText variant="body" style={styles.employeeName}>
            {item.name}
          </AppText>
          <AppText variant="bodySmall" color={Colors.textSecondary}>
            {item.role}
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: Spacing.xs }}>
            {item.email}
          </AppText>
        </View>
      </View>
      <View style={styles.employeeCost}>
        <AppText variant="bodyLarge" color={Colors.primary}>
          {EmployeeCostCalculator.formatPerMinuteCost(item.perMinuteCost)}
        </AppText>
        <AppText variant="caption" color={Colors.textSecondary}>
          {EmployeeCostCalculator.formatHourlyCost(item.hourlyCost)}
        </AppText>
      </View>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon} />
      <AppText variant="h3" style={styles.emptyTitle}>
        No employees yet
      </AppText>
      <AppText variant="body" color={Colors.textSecondary} style={styles.emptyText}>
        Add your first employee to start calculating meeting costs
      </AppText>
      <Button
        title="Add Employee"
        onPress={() => navigation.navigate('AddEmployee', { onEmployeeAdded: loadEmployees })}
        style={{ marginTop: Spacing.lg }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AppText variant="body" color={Colors.primary}>
            ‹ Back
          </AppText>
        </TouchableOpacity>
        <AppText variant="h2">Employees</AppText>
        <AppText variant="bodySmall" color={Colors.textSecondary}>
          {employees.length} {employees.length === 1 ? 'employee' : 'employees'}
        </AppText>
      </View>

      {employees.length > 0 && (
        <>
          {/* Search */}
          <View style={styles.searchContainer}>
            <Input
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder="Search by name, role, or email"
              style={{ marginBottom: 0 }}
            />
          </View>

          {/* List */}
          <FlatList
            data={filteredEmployees}
            renderItem={renderEmployee}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              searchQuery ? (
                <View style={styles.emptyState}>
                  <AppText variant="body" color={Colors.textSecondary}>
                    No employees found matching "{searchQuery}"
                  </AppText>
                </View>
              ) : null
            }
          />

          {/* Add Button */}
          <View style={styles.addButtonContainer}>
            <Button
              title="Add Employee"
              onPress={() => navigation.navigate('AddEmployee', { onEmployeeAdded: loadEmployees })}
            />
          </View>
        </>
      )}

      {employees.length === 0 && !loading && renderEmpty()}
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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
  list: {
    paddingBottom: 80,
  },
  employeeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  employeeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontWeight: '600',
  },
  employeeCost: {
    alignItems: 'flex-end',
    marginLeft: Spacing.sm,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.gray200,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});

export default EmployeeListScreen;
