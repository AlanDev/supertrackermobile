import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/strings';

export class StorageService {
  /**
   * Store data in AsyncStorage
   */
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get data from AsyncStorage
   */
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      // Clean up corrupted data
      await this.removeItem(key);
      return null;
    }
  }

  /**
   * Remove data from AsyncStorage
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all data from AsyncStorage
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Get all keys from AsyncStorage
   */
  static async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Check if key exists in AsyncStorage
   */
  static async hasKey(key: string): Promise<boolean> {
    try {
      const keys = await this.getAllKeys();
      return keys.includes(key);
    } catch (error) {
      console.error(`Error checking key ${key}:`, error);
      return false;
    }
  }

  /**
   * Clean up corrupted data for specific app keys
   */
  static async cleanupCorruptedData(): Promise<void> {
    const appKeys = Object.values(STORAGE_KEYS);
    
    for (const key of appKeys) {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          JSON.parse(value); // Test if valid JSON
        }
      } catch (error) {
        console.warn(`Cleaning up corrupted data for key: ${key}`);
        await this.removeItem(key);
      }
    }
  }

  /**
   * Migrate data between storage versions
   */
  static async migrateData(): Promise<void> {
    try {
      // Check if migration is needed
      const version = await this.getItem<string>('storage_version');
      
      if (!version || version < '1.0') {
        // Perform migration tasks here
        await this.cleanupCorruptedData();
        await this.setItem('storage_version', '1.0');
      }
    } catch (error) {
      console.error('Error during data migration:', error);
    }
  }
}

export default StorageService; 