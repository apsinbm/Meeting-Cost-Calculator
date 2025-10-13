import StorageService from './StorageService';

/**
 * CompanyService
 * Manages company settings (name, currency, etc.)
 */

const COMPANY_SETTINGS_KEY = '@company_settings';

const DEFAULT_SETTINGS = {
  companyName: '',
  currency: 'BMD', // Bermuda Dollar
  workWeekHours: 40,
};

const SUPPORTED_CURRENCIES = [
  { code: 'BMD', name: 'Bermuda Dollar (BMD)', symbol: '$' },
  { code: 'USD', name: 'US Dollar (USD)', symbol: '$' },
  { code: 'EUR', name: 'Euro (EUR)', symbol: '€' },
  { code: 'GBP', name: 'British Pound (GBP)', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar (CAD)', symbol: '$' },
  { code: 'AUD', name: 'Australian Dollar (AUD)', symbol: '$' },
  { code: 'JPY', name: 'Japanese Yen (JPY)', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc (CHF)', symbol: 'Fr' },
];

class CompanyService {
  /**
   * Get company settings
   */
  static async getSettings() {
    try {
      const settings = await StorageService.getData(COMPANY_SETTINGS_KEY);
      return settings || DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error getting company settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Update company name
   */
  static async updateCompanyName(companyName) {
    try {
      const settings = await this.getSettings();
      const updatedSettings = { ...settings, companyName };
      await StorageService.saveData(COMPANY_SETTINGS_KEY, updatedSettings);
      return { success: true, settings: updatedSettings };
    } catch (error) {
      console.error('Error updating company name:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update currency
   */
  static async updateCurrency(currencyCode) {
    try {
      const settings = await this.getSettings();
      const updatedSettings = { ...settings, currency: currencyCode };
      await StorageService.saveData(COMPANY_SETTINGS_KEY, updatedSettings);
      return { success: true, settings: updatedSettings };
    } catch (error) {
      console.error('Error updating currency:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update work week hours
   */
  static async updateWorkWeekHours(hours) {
    try {
      const settings = await this.getSettings();
      const updatedSettings = { ...settings, workWeekHours: hours };
      await StorageService.saveData(COMPANY_SETTINGS_KEY, updatedSettings);
      return { success: true, settings: updatedSettings };
    } catch (error) {
      console.error('Error updating work week hours:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get list of supported currencies
   */
  static getSupportedCurrencies() {
    return SUPPORTED_CURRENCIES;
  }

  /**
   * Get currency by code
   */
  static getCurrency(code) {
    return SUPPORTED_CURRENCIES.find(c => c.code === code) || SUPPORTED_CURRENCIES[0];
  }
}

export default CompanyService;
