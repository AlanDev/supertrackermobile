import { useState, useEffect, useCallback } from 'react';
import AuthService, { User } from '../services/authService';

interface UseAuthReturn {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const loggedIn = await AuthService.isLoggedIn();
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const userData = await AuthService.login(email, password);
      
      if (userData) {
        setUser(userData);
        setIsLoggedIn(true);
        return true;
      } else {
        setUser(null);
        setIsLoggedIn(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      setIsLoggedIn(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (
    email: string, 
    password: string, 
    name?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const userData = await AuthService.register(email, password, name);
      
      if (userData) {
        setUser(userData);
        setIsLoggedIn(true);
        return true;
      } else {
        setUser(null);
        setIsLoggedIn(false);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setUser(null);
      setIsLoggedIn(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      await AuthService.logout();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    try {
      const updatedUser = await AuthService.updateProfile(updates);
      
      if (updatedUser) {
        setUser(updatedUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      return await AuthService.resetPassword(email);
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    await checkAuthState();
  }, [checkAuthState]);

  return {
    user,
    isLoggedIn,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    refreshUser,
  };
}

export default useAuth; 