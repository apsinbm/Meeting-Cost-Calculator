// Bermuda-Specific Employment Cost Defaults
// These values are configurable in Settings but provide sensible defaults

export const BermudaDefaults = {
  // Tax Rates (as percentages)
  payrollTaxRate: 10,         // 10% - typical Bermuda payroll tax
  socialInsuranceRate: 5,     // 5% - typical social insurance contribution

  // Benefits
  standardHealthInsurance: 12000,  // $12,000 annual - company pays half ($6,000)

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
  meetingDuration: {
    min: 1,              // 1 minute minimum
    max: 1440,           // 24 hours maximum (in minutes)
  },
};

export default BermudaDefaults;
