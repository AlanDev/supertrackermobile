import StorageService from './storageService';
import { STORAGE_KEYS } from '../constants/strings';

export interface User {
  email: string;
  name?: string;
  avatar?: string;
  createdAt?: string;
}

export class AuthService {
 
  static async login(email: string, password: string): Promise<User | null> {
    try {
      
      const userData: User = {
        email,
        name: email.split('@')[0], 
        createdAt: new Date().toISOString(),
      };

      await StorageService.setItem(STORAGE_KEYS.userEmail, email);
      await StorageService.setItem('user_logged_in', true);
      await StorageService.setItem('user_data', userData);

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  static async register(email: string, password: string, name?: string): Promise<User | null> {
    try {
      const userData: User = {
        email,
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString(),
      };

      await StorageService.setItem(STORAGE_KEYS.userEmail, email);
      await StorageService.setItem('user_logged_in', true);
      await StorageService.setItem('user_data', userData);

      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  }


  static async logout(): Promise<void> {
    try {
      await StorageService.removeItem(STORAGE_KEYS.userEmail);
      await StorageService.removeItem('user_logged_in');
      await StorageService.removeItem('user_data');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  static async isLoggedIn(): Promise<boolean> {
    try {
      const isLoggedIn = await StorageService.getItem<boolean>('user_logged_in');
      const email = await StorageService.getItem<string>(STORAGE_KEYS.userEmail);
      return isLoggedIn === true && !!email;
    } catch (error) {
      console.error('Check login status error:', error);
      return false;
    }
  }

  
  static async getCurrentUser(): Promise<User | null> {
    try {
      const isLoggedIn = await this.isLoggedIn();
      if (!isLoggedIn) return null;

      const userData = await StorageService.getItem<User>('user_data');
      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static async updateProfile(updates: Partial<User>): Promise<User | null> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) return null;

      const updatedUser = { ...currentUser, ...updates };
      await StorageService.setItem('user_data', updatedUser);

      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      return null;
    }
  }

  
  static async resetPassword(email: string): Promise<boolean> {
    try {
      console.log('Password reset requested for:', email);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  }
}

export default AuthService; 