import StorageService from './StorageService';
import EmployeeCostCalculator from './EmployeeCostCalculator';
import ValidationService from './ValidationService';

/**
 * EmployeeService
 * Manages employee profiles and compensation data
 */

class EmployeeService {
  /**
   * Get all employees
   */
  async getEmployees() {
    try {
      return await StorageService.getEmployees();
    } catch (error) {
      console.error('Error getting employees:', error);
      return [];
    }
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id) {
    try {
      const employees = await this.getEmployees();
      return employees.find(emp => emp.id === id);
    } catch (error) {
      console.error('Error getting employee:', error);
      return null;
    }
  }

  /**
   * Add new employee
   */
  async addEmployee(employeeData) {
    try {
      // Validate employee data
      const validation = ValidationService.validateEmployee(employeeData);
      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors,
        };
      }

      // Get current settings for cost calculation
      const settings = await StorageService.getSettings();

      // Calculate costs
      const costs = EmployeeCostCalculator.calculateEmployeeCost(employeeData, settings);

      // Create employee object
      const employee = {
        id: this._generateId(),
        name: employeeData.name.trim(),
        role: employeeData.role.trim(),
        email: employeeData.email ? employeeData.email.trim().toLowerCase() : '',
        annualSalary: parseFloat(employeeData.annualSalary),
        annualBonus: parseFloat(employeeData.annualBonus) || 0,
        includesHealthInsurance: employeeData.includesHealthInsurance !== false,
        hourlyCost: costs.hourlyCost,
        perMinuteCost: costs.perMinuteCost,
        totalAnnualCost: costs.totalAnnualCost,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Get existing employees
      const employees = await this.getEmployees();

      // Check for duplicate email only if email was provided
      if (employee.email && employees.some(emp => emp.email === employee.email)) {
        return {
          success: false,
          errors: { email: 'An employee with this email already exists' },
        };
      }

      // Add to array
      employees.push(employee);

      // Save
      await StorageService.saveEmployees(employees);

      return {
        success: true,
        employee,
      };
    } catch (error) {
      console.error('Error adding employee:', error);
      return {
        success: false,
        errors: { general: 'Failed to add employee' },
      };
    }
  }

  /**
   * Update existing employee
   */
  async updateEmployee(id, employeeData) {
    try {
      // Validate employee data
      const validation = ValidationService.validateEmployee(employeeData);
      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors,
        };
      }

      // Get existing employees
      const employees = await this.getEmployees();
      const index = employees.findIndex(emp => emp.id === id);

      if (index === -1) {
        return {
          success: false,
          errors: { general: 'Employee not found' },
        };
      }

      // Check for duplicate email (excluding current employee) only if email provided
      const emailToCheck = employeeData.email ? employeeData.email.trim().toLowerCase() : '';
      if (emailToCheck) {
        const duplicateEmail = employees.find(
          emp => emp.email === emailToCheck && emp.id !== id
        );
        if (duplicateEmail) {
          return {
            success: false,
            errors: { email: 'An employee with this email already exists' },
          };
        }
      }

      // Get current settings for cost calculation
      const settings = await StorageService.getSettings();

      // Calculate costs
      const costs = EmployeeCostCalculator.calculateEmployeeCost(employeeData, settings);

      // Update employee
      employees[index] = {
        ...employees[index],
        name: employeeData.name.trim(),
        role: employeeData.role.trim(),
        email: employeeData.email ? employeeData.email.trim().toLowerCase() : '',
        annualSalary: parseFloat(employeeData.annualSalary),
        annualBonus: parseFloat(employeeData.annualBonus) || 0,
        includesHealthInsurance: employeeData.includesHealthInsurance !== false,
        hourlyCost: costs.hourlyCost,
        perMinuteCost: costs.perMinuteCost,
        totalAnnualCost: costs.totalAnnualCost,
        updatedAt: new Date().toISOString(),
      };

      // Save
      await StorageService.saveEmployees(employees);

      return {
        success: true,
        employee: employees[index],
      };
    } catch (error) {
      console.error('Error updating employee:', error);
      return {
        success: false,
        errors: { general: 'Failed to update employee' },
      };
    }
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id) {
    try {
      const employees = await this.getEmployees();
      const filteredEmployees = employees.filter(emp => emp.id !== id);

      if (filteredEmployees.length === employees.length) {
        return {
          success: false,
          error: 'Employee not found',
        };
      }

      await StorageService.saveEmployees(filteredEmployees);

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting employee:', error);
      return {
        success: false,
        error: 'Failed to delete employee',
      };
    }
  }

  /**
   * Search employees by name or email
   */
  async searchEmployees(query) {
    try {
      const employees = await this.getEmployees();
      const lowerQuery = query.toLowerCase();

      return employees.filter(emp =>
        emp.name.toLowerCase().includes(lowerQuery) ||
        emp.email.toLowerCase().includes(lowerQuery) ||
        emp.role.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching employees:', error);
      return [];
    }
  }

  /**
   * Get employee by email (for calendar attendee matching)
   */
  async getEmployeeByEmail(email) {
    try {
      const employees = await this.getEmployees();
      return employees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
    } catch (error) {
      console.error('Error getting employee by email:', error);
      return null;
    }
  }

  /**
   * Recalculate all employee costs (when settings change)
   */
  async recalculateAllCosts() {
    try {
      const employees = await this.getEmployees();
      const settings = await StorageService.getSettings();

      const updatedEmployees = EmployeeCostCalculator.recalculateAllEmployees(employees, settings);

      await StorageService.saveEmployees(updatedEmployees);

      return {
        success: true,
        employees: updatedEmployees,
      };
    } catch (error) {
      console.error('Error recalculating costs:', error);
      return {
        success: false,
        error: 'Failed to recalculate costs',
      };
    }
  }

  /**
   * Generate unique ID
   */
  _generateId() {
    return `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default new EmployeeService();
