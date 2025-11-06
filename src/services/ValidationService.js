import { ValidationRules } from '../constants';

/**
 * ValidationService
 * Validates all user inputs including salary data
 */

class ValidationService {
  /**
   * Validate employee name
   */
  validateName(name) {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Name is required' };
    }
    if (name.trim().length < 2) {
      return { valid: false, error: 'Name must be at least 2 characters' };
    }
    return { valid: true };
  }

  /**
   * Validate employee role
   */
  validateRole(role) {
    if (!role || role.trim().length === 0) {
      return { valid: false, error: 'Role is required' };
    }
    return { valid: true };
  }

  /**
   * Validate email address (optional)
   */
  validateEmail(email) {
    // Email is now optional - skip validation if empty
    if (!email || email.trim().length === 0) {
      return { valid: true };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Invalid email format' };
    }

    return { valid: true };
  }

  /**
   * Validate annual salary
   */
  validateSalary(salary) {
    const numSalary = parseFloat(salary);

    if (isNaN(numSalary)) {
      return { valid: false, error: 'Salary must be a number' };
    }

    if (numSalary < ValidationRules.salary.min) {
      return { valid: false, error: `Salary must be at least $${ValidationRules.salary.min.toLocaleString()}` };
    }

    if (numSalary > ValidationRules.salary.max) {
      return { valid: false, error: `Salary cannot exceed $${ValidationRules.salary.max.toLocaleString()}` };
    }

    return { valid: true };
  }

  /**
   * Validate annual bonus
   */
  validateBonus(bonus) {
    // DEBUG: Log bonus validation
    console.log('=== ValidationService.validateBonus ===');
    console.log('Input bonus:', bonus);
    console.log('Input type:', typeof bonus);
    console.log('Input length:', bonus?.length);

    // Bonus is optional, can be 0
    if (!bonus || bonus === '') {
      console.log('Bonus is empty - valid');
      return { valid: true };
    }

    const numBonus = parseFloat(bonus);
    console.log('parseFloat(bonus):', numBonus);
    console.log('Parsed type:', typeof numBonus);
    console.log('ValidationRules.bonus.max:', ValidationRules.bonus.max);

    if (isNaN(numBonus)) {
      console.log('Bonus is NaN - invalid');
      return { valid: false, error: 'Bonus must be a number' };
    }

    if (numBonus < ValidationRules.bonus.min) {
      console.log('Bonus is negative - invalid');
      return { valid: false, error: 'Bonus cannot be negative' };
    }

    if (numBonus > ValidationRules.bonus.max) {
      console.log('Bonus exceeds max - invalid');
      return { valid: false, error: `Bonus cannot exceed $${ValidationRules.bonus.max.toLocaleString()}` };
    }

    console.log('Bonus validation passed');
    return { valid: true };
  }

  /**
   * Validate health insurance cost
   */
  validateHealthInsurance(amount) {
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount)) {
      return { valid: false, error: 'Health insurance must be a number' };
    }

    if (numAmount < ValidationRules.healthInsurance.min) {
      return { valid: false, error: `Health insurance must be at least $${ValidationRules.healthInsurance.min}` };
    }

    if (numAmount > ValidationRules.healthInsurance.max) {
      return { valid: false, error: `Health insurance cannot exceed $${ValidationRules.healthInsurance.max.toLocaleString()}` };
    }

    return { valid: true };
  }

  /**
   * Validate tax rate percentage
   */
  validateTaxRate(rate) {
    const numRate = parseFloat(rate);

    if (isNaN(numRate)) {
      return { valid: false, error: 'Tax rate must be a number' };
    }

    if (numRate < ValidationRules.taxRate.min) {
      return { valid: false, error: 'Tax rate cannot be negative' };
    }

    if (numRate > ValidationRules.taxRate.max) {
      return { valid: false, error: 'Tax rate cannot exceed 100%' };
    }

    return { valid: true };
  }

  /**
   * Validate meeting duration in minutes
   */
  validateDuration(minutes) {
    const numMinutes = parseFloat(minutes);

    if (isNaN(numMinutes)) {
      return { valid: false, error: 'Duration must be a number' };
    }

    if (numMinutes < ValidationRules.meetingDuration.min) {
      return { valid: false, error: 'Duration must be at least 1 minute' };
    }

    if (numMinutes > ValidationRules.meetingDuration.max) {
      return { valid: false, error: 'Duration cannot exceed 24 hours' };
    }

    return { valid: true };
  }

  /**
   * Validate complete employee data
   */
  validateEmployee(employee) {
    const errors = {};

    const nameValidation = this.validateName(employee.name);
    if (!nameValidation.valid) errors.name = nameValidation.error;

    const roleValidation = this.validateRole(employee.role);
    if (!roleValidation.valid) errors.role = roleValidation.error;

    const emailValidation = this.validateEmail(employee.email);
    if (!emailValidation.valid) errors.email = emailValidation.error;

    const salaryValidation = this.validateSalary(employee.annualSalary);
    if (!salaryValidation.valid) errors.annualSalary = salaryValidation.error;

    if (employee.annualBonus) {
      const bonusValidation = this.validateBonus(employee.annualBonus);
      if (!bonusValidation.valid) errors.annualBonus = bonusValidation.error;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export default new ValidationService();
