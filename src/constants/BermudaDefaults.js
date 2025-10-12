// Bermuda-Specific Employment Cost Defaults
// These values are configurable in Settings but provide sensible defaults

export const BermudaDefaults = {
  // Tax Rates
  payrollTaxRate: 10,         // 10% - for companies with payroll over $1M (2025-26 rate)
  payrollTaxCap: 1000000,     // $1M cap per employee for payroll tax calculation

  // Social Insurance (Contributory Pensions Act 1970)
  // Fixed weekly contribution, NOT percentage-based
  socialInsuranceWeekly: 37.65,    // $37.65/week employer portion (as of August 1, 2025)
  socialInsuranceAnnual: 1957.80,  // $37.65 × 52 weeks = $1,957.80/year per employee

  // Pension (Occupational Pensions Act)
  employerPensionRate: 5,          // 5% employer match (typical rate)

  // Benefits
  defaultHealthInsuranceMonthly: 500,  // $500/month per employee default (editable for dependents)
  defaultHealthInsuranceAnnual: 6000,  // $500 × 12 months

  // Currency
  defaultCurrency: 'BMD',     // Bermuda Dollar
  currencySymbol: '$',

  // Work Schedule
  workHoursPerWeek: 40,       // Standard full-time
  workWeeksPerYear: 52,
  workHoursPerYear: 2080,     // 40 hours/week * 52 weeks

  // Milestone Intervals (in minutes)
  milestones: [1, 15, 30, 45, 60, 75, 90, 105, 120],
  milestoneInterval: 15,      // Continue pattern at 15-minute intervals beyond 120

  // Default Notification Milestones (which ones trigger notifications)
  notificationMilestones: [30, 60, 90, 120],
};

// Available currency options
export const SupportedCurrencies = [
  { code: 'BMD', name: 'Bermuda Dollar', symbol: '$' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
];

// Validation constraints
export const ValidationRules = {
  salary: {
    min: 1000,
    max: 10000000,
  },
  bonus: {
    min: 0,
    max: 10000000,
  },
  healthInsurance: {
    min: 100,
    max: 100000,
  },
  taxRate: {
    min: 0,
    max: 100,
  },
  socialInsuranceWeekly: {
    min: 0,
    max: 500,
  },
  meetingDuration: {
    min: 1,              // 1 minute minimum
    max: 1440,           // 24 hours maximum (in minutes)
  },
};

export default BermudaDefaults;
