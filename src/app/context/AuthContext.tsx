import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService, { User } from '../../services/authService';
import StorageService from '../../services/storageService';

interface AuthContextData {
  isLoggedIn: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<boolean>;
  isLoading: boolean;
  refreshAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      setIsLoading(true);
      
      await StorageService.cleanupCorruptedData();
      await StorageService.migrateData();
      
      const [loggedIn, user] = await Promise.all([
        AuthService.isLoggedIn(),
        AuthService.getCurrentUser(),
      ]);
      
      setIsLoggedIn(loggedIn);
      setCurrentUser(user);
    } catch (error) {
      console.log('Error checking login status:', error);
      setIsLoggedIn(false);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await AuthService.login(email, password);
      
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.log('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await AuthService.register(email, password);
      
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.log('Registration error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      setIsLoggedIn(false);
      setCurrentUser(null);
    } catch (error) {
      console.log('Error logging out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      currentUser,
      login, 
      logout, 
      register, 
      isLoading,
      refreshAuthStatus: checkLoginStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 