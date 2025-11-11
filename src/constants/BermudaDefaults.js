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

  // Benefits - Health Insurance Plans (8 options, employee selects one)
  defaultHealthInsurancePlan: 'Employee only',  // Default plan
  defaultHealthInsuranceMonthly: 429.61,  // $429.61/month for "Employee only" (default)
  defaultHealthInsuranceAnnual: 5155.32,  // $429.61 × 12 months

  // All 8 health insurance plan options
  healthInsurancePlans: [
    { name: 'Employee only', monthly: 429.61, annual: 5155.32 },
    { name: 'Employee and non-working spouse', monthly: 864.28, annual: 10371.36 },
    { name: 'Employee, non-working spouse & child(ren)', monthly: 1087.28, annual: 13047.36 },
    { name: 'Employee & child(ren)', monthly: 652.60, annual: 7831.20 },
    { name: 'Employee & working spouse', monthly: 664.13, annual: 7969.56 },
    { name: 'Employee, working spouse & child(ren)', monthly: 887.12, annual: 10645.44 },
    { name: 'HIP, Employee only', monthly: 200.16, annual: 2401.92 },
    { name: 'HIP, Employee & non-working spouse', monthly: 400.31, annual: 4803.72 },
  ],

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
