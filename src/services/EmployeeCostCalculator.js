import { BermudaDefaults } from '../constants';

/**
 * EmployeeCostCalculator
 * Calculates true cost to company including all Bermuda employment expenses
 *
 * Formula:
 * Total Annual Cost = Salary + Bonus + (Health Insurance / 2) + Payroll Tax + Social Insurance
 * Hourly Cost = Total Annual Cost / 2080 hours (40 hours/week * 52 weeks)
 * Per-Minute Cost = Hourly Cost / 60
 */

class EmployeeCostCalculator {
  /**
   * Calculate complete employee cost breakdown
   * @param {object} employee - Employee with salary, bonus, etc.
   * @param {object} settings - App settings with tax rates
   * @returns {object} Complete cost breakdown
   */
  calculateEmployeeCost(employee, settings = null) {
    const {
      annualSalary = 0,
      annualBonus = 0,
      includesHealthInsurance = true,
    } = employee;

    // Get rates from settings or use defaults
    const payrollTaxRate = settings?.payrollTaxRate || BermudaDefaults.payrollTaxRate;
    const socialInsuranceRate = settings?.socialInsuranceRate || BermudaDefaults.socialInsuranceRate;
    const standardHealthInsurance = settings?.standardHealthInsurance || BermudaDefaults.standardHealthInsurance;

    // Step 1: Total Annual Compensation
    const totalCompensation = this._safeNumber(annualSalary) + this._safeNumber(annualBonus);

    // Step 2: Health Insurance Company Portion (company pays half)
    const healthInsuranceCompanyPortion = includesHealthInsurance
      ? standardHealthInsurance / 2
      : 0;

    // Step 3: Payroll Tax (calculated on total compensation)
    const payrollTax = totalCompensation * (payrollTaxRate / 100);

    // Step 4: Social Insurance (calculated on base salary)
    const socialInsurance = this._safeNumber(annualSalary) * (socialInsuranceRate / 100);

    // Step 5: Total Annual Cost to Company
    const totalAnnualCost = totalCompensation + healthInsuranceCompanyPortion + payrollTax + socialInsurance;

    // Step 6: Hourly Cost (based on 40-hour work week, 52 weeks)
    const hourlyCost = totalAnnualCost / BermudaDefaults.workHoursPerYear;

    // Step 7: Per-Minute Cost
    const perMinuteCost = hourlyCost / 60;

    return {
      // Components
      annualSalary: this._round2(annualSalary),
      annualBonus: this._round2(annualBonus),
      totalCompensation: this._round2(totalCompensation),
      healthInsuranceCompanyPortion: this._round2(healthInsuranceCompanyPortion),
      payrollTax: this._round2(payrollTax),
      socialInsurance: this._round2(socialInsurance),

      // Totals
      totalAnnualCost: this._round2(totalAnnualCost),
      hourlyCost: this._round2(hourlyCost),
      perMinuteCost: this._round3(perMinuteCost),

      // Rates used
      payrollTaxRate,
      socialInsuranceRate,
      standardHealthInsurance,
    };
  }

  /**
   * Calculate just the per-minute cost (for quick access)
   */
  calculatePerMinuteCost(employee, settings = null) {
    const breakdown = this.calculateEmployeeCost(employee, settings);
    return breakdown.perMinuteCost;
  }

  /**
   * Calculate just the hourly cost (for quick access)
   */
  calculateHourlyCost(employee, settings = null) {
    const breakdown = this.calculateEmployeeCost(employee, settings);
    return breakdown.hourlyCost;
  }

  /**
   * Recalculate costs for multiple employees
   */
  recalculateAllEmployees(employees, settings = null) {
    return employees.map(employee => {
      const costs = this.calculateEmployeeCost(employee, settings);
      return {
        ...employee,
        hourlyCost: costs.hourlyCost,
        perMinuteCost: costs.perMinuteCost,
        totalAnnualCost: costs.totalAnnualCost,
      };
    });
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount, decimals = 2) {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '$0.00';
    }
    return `$${amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }

  /**
   * Format per-minute cost for display
   */
  formatPerMinuteCost(cost) {
    return `${this.formatCurrency(cost, 3)}/min`;
  }

  /**
   * Format hourly cost for display
   */
  formatHourlyCost(cost) {
    return `${this.formatCurrency(cost, 2)}/hour`;
  }

  /**
   * Safe number conversion (prevents NaN)
   */
  _safeNumber(value) {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Round to 2 decimal places
   */
  _round2(value) {
    return Math.round(value * 100) / 100;
  }

  /**
   * Round to 3 decimal places (for per-minute costs)
   */
  _round3(value) {
    return Math.round(value * 1000) / 1000;
  }
}

export default new EmployeeCostCalculator();
