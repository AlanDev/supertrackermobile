import { useState, useEffect, useCallback } from 'react';
import StorageService from '../services/storageService';

type AsyncStorageHook<T> = [
  T | null,
  (value: T | null) => Promise<void>,
  boolean,
  string | null
];

export function useAsyncStorage<T>(
  key: string,
  initialValue: T | null = null
): AsyncStorageHook<T> {
  const [storedValue, setStoredValue] = useState<T | null>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const value = await StorageService.getItem<T>(key);
        setStoredValue(value !== null ? value : initialValue);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fallo al cargar el valor');
        setStoredValue(initialValue);
      } finally {
        setLoading(false);
      }
    };

    loadStoredValue();
  }, [key, initialValue]);

  const setValue = useCallback(async (value: T | null) => {
    try {
      setError(null);
      
      if (value === null) {
        await StorageService.removeItem(key);
      } else {
        await StorageService.setItem(key, value);
      }
      
      setStoredValue(value);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Fallo al guardar el valor';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [key]);

  return [storedValue, setValue, loading, error];
}

export function useAsyncStorageString(
  key: string,
  initialValue = ''
): AsyncStorageHook<string> {
  return useAsyncStorage<string>(key, initialValue);
}

export function useAsyncStorageObject<T extends Record<string, any>>(
  key: string,
  initialValue: T | null = null
): AsyncStorageHook<T> {
  return useAsyncStorage<T>(key, initialValue);
}

export function useAsyncStorageArray<T>(
  key: string,
  initialValue: T[] = []
): AsyncStorageHook<T[]> {
  return useAsyncStorage<T[]>(key, initialValue);
}

export function useAsyncStorageBoolean(
  key: string,
  initialValue = false
): AsyncStorageHook<boolean> {
  return useAsyncStorage<boolean>(key, initialValue);
}

export default useAsyncStorage; 