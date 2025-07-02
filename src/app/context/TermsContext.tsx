import React, { createContext, useState, useEffect, useContext } from 'react';
import StorageService from '../../services/storageService';
import { STORAGE_KEYS } from '../../constants/strings';

interface TermsContextData {
  hasAcceptedTerms: boolean;
  acceptTerms: () => Promise<void>;
  isLoading: boolean;
}

const TermsContext = createContext<TermsContextData | undefined>(undefined);

export const TermsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkTermsStatus();
  }, []);

  const checkTermsStatus = async () => {
    try {
      setIsLoading(true);
      const termsAccepted = await StorageService.getItem<boolean>(STORAGE_KEYS.termsAccepted);
      setHasAcceptedTerms(termsAccepted === true);
    } catch (error) {
      console.log('Error checking terms status:', error);
      setHasAcceptedTerms(false);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptTerms = async (): Promise<void> => {
    try {
      await StorageService.setItem(STORAGE_KEYS.termsAccepted, true);
      setHasAcceptedTerms(true);
    } catch (error) {
      console.log('Error accepting terms:', error);
      throw error;
    }
  };

  return (
    <TermsContext.Provider value={{ hasAcceptedTerms, acceptTerms, isLoading }}>
      {children}
    </TermsContext.Provider>
  );
};

export const useTerms = () => {
  const context = useContext(TermsContext);
  if (context === undefined) {
    throw new Error('useTerms must be used within a TermsProvider');
  }
  return context;
};

export default TermsContext; 