import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * StorageService
 * Wrapper around AsyncStorage for sensitive data persistence
 * All employee and meeting data stored locally on device
 */

const KEYS = {
  EMPLOYEES: '@employees',
  MEETINGS: '@meetings',
  SETTINGS: '@settings',
  ONBOARDING_COMPLETE: '@onboarding_complete',
};

class StorageService {
  /**
   * Save employees array
   */
  async saveEmployees(employees) {
    try {
      await AsyncStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
      return true;
    } catch (error) {
      console.error('Error saving employees:', error);
      throw new Error('Failed to save employees');
    }
  }

  /**
   * Get all employees
   */
  async getEmployees() {
    try {
      const data = await AsyncStorage.getItem(KEYS.EMPLOYEES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting employees:', error);
      return [];
    }
  }

  /**
   * Save meetings array
   */
  async saveMeetings(meetings) {
    try {
      await AsyncStorage.setItem(KEYS.MEETINGS, JSON.stringify(meetings));
      return true;
    } catch (error) {
      console.error('Error saving meetings:', error);
      throw new Error('Failed to save meetings');
    }
  }

  /**
   * Get all meetings
   */
  async getMeetings() {
    try {
      const data = await AsyncStorage.getItem(KEYS.MEETINGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting meetings:', error);
      return [];
    }
  }

  /**
   * Save app settings
   */
  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  }

  /**
   * Get app settings
   */
  async getSettings() {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }

  /**
   * Mark onboarding as complete
   */
  async setOnboardingComplete(complete = true) {
    try {
      await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETE, complete.toString());
      return true;
    } catch (error) {
      console.error('Error setting onboarding:', error);
      return false;
    }
  }

  /**
   * Check if onboarding is complete
   */
  async isOnboardingComplete() {
    try {
      const data = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETE);
      return data === 'true';
    } catch (error) {
      console.error('Error checking onboarding:', error);
      return false;
    }
  }

  /**
   * Generic save data method
   */
  async saveData(key, data) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
      throw new Error(`Failed to save data for key ${key}`);
    }
  }

  /**
   * Generic get data method
   */
  async getData(key) {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting data for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Clear all data (for testing/reset)
   */
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        KEYS.EMPLOYEES,
        KEYS.MEETINGS,
        KEYS.SETTINGS,
        KEYS.ONBOARDING_COMPLETE,
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}

export default new StorageService();
