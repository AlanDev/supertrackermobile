import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextData {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar estado de autenticación al cargar la aplicación
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
      const email = await AsyncStorage.getItem('userEmail');
      const password = await AsyncStorage.getItem('userPassword');
      
      const isAuthenticated = 
        userLoggedIn === 'true' || 
        (email === 'ejemplo@gmail.com' && password === '123456');
      
      setIsLoggedIn(isAuthenticated);
      setIsLoading(false);
    } catch (error) {
      console.log('Error checking login status:', error);
      setIsLoading(false);
      setIsLoggedIn(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === "ejemplo@gmail.com" && password === "123456") {
      try {
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userPassword', password);
        await AsyncStorage.setItem('userLoggedIn', 'true');
        setIsLoggedIn(true);
        return true;
      } catch (error) {
        console.log('Error storing credentials:', error);
        return false;
      }
    } else {
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userPassword', password);
      await AsyncStorage.setItem('userLoggedIn', 'true');
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.log('Error registering user:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userPassword');
      await AsyncStorage.removeItem('userLoggedIn');
      setIsLoggedIn(false);
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 