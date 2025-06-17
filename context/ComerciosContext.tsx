import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
}

export interface Comercio {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  categoria: string;
  horarios: string;
  descripcion: string;
  productos: Product[];
  latitude?: number;
  longitude?: number;
  rating?: number;
  imagenUrl?: string;
  distancia?: string;
}

interface ComerciosContextType {
  comercios: Comercio[];
  misComercio: Comercio | null;
  saveComercio: (comercio: Omit<Comercio, 'id'>) => Promise<boolean>;
  updateComercio: (id: string, comercio: Omit<Comercio, 'id'>) => Promise<boolean>;
  deleteComercio: (id: string) => Promise<boolean>;
  getMisComercio: () => Comercio | null;
  loadComercio: (id: string) => Comercio | null;
  isLoading: boolean;
}

const ComerciosContext = createContext<ComerciosContextType | undefined>(undefined);

const COMERCIOS_STORAGE_KEY = '@user_comercios';

export const ComerciosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [comercios, setComercios] = useState<Comercio[]>([]);
  const [misComercio, setMisComercio] = useState<Comercio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar comercios al inicializar
  useEffect(() => {
    loadComerciosFromStorage();
  }, []);

  const loadComerciosFromStorage = async () => {
    try {
      const savedComercios = await AsyncStorage.getItem(COMERCIOS_STORAGE_KEY);
      if (savedComercios) {
        const parsedComercios = JSON.parse(savedComercios);
        setComercios(parsedComercios);
        // Buscar el comercio del usuario actual
        const userComercio = parsedComercios.find((c: Comercio) => c.id === 'user_comercio');
        setMisComercio(userComercio || null);
      }
    } catch (error) {
      console.error('Error loading comercios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveComerciosToStorage = async (newComercios: Comercio[]) => {
    try {
      await AsyncStorage.setItem(COMERCIOS_STORAGE_KEY, JSON.stringify(newComercios));
      return true;
    } catch (error) {
      console.error('Error saving comercios:', error);
      return false;
    }
  };

  const saveComercio = async (comercioData: Omit<Comercio, 'id'>): Promise<boolean> => {
    try {
      const newComercio: Comercio = {
        ...comercioData,
        id: 'user_comercio', // Por ahora solo permitimos un comercio por usuario
        // Agregar coordenadas por defecto (podrían ser calculadas desde la dirección)
        latitude: -34.6037 + (Math.random() - 0.5) * 0.01,
        longitude: -58.3816 + (Math.random() - 0.5) * 0.01,
        rating: 4.5,
        imagenUrl: "https://img.freepik.com/free-photo/shopping-cart-supermarket_23-2148879372.jpg?size=626&ext=jpg",
        distancia: "Tu comercio"
      };

      const updatedComercios = comercios.filter(c => c.id !== 'user_comercio');
      updatedComercios.push(newComercio);
      
      const success = await saveComerciosToStorage(updatedComercios);
      if (success) {
        setComercios(updatedComercios);
        setMisComercio(newComercio);
      }
      return success;
    } catch (error) {
      console.error('Error saving comercio:', error);
      return false;
    }
  };

  const updateComercio = async (id: string, comercioData: Omit<Comercio, 'id'>): Promise<boolean> => {
    try {
      const updatedComercios = comercios.map(c => 
        c.id === id 
          ? { ...comercioData, id, 
              latitude: c.latitude || -34.6037,
              longitude: c.longitude || -58.3816,
              rating: c.rating || 4.5,
              imagenUrl: c.imagenUrl || "https://img.freepik.com/free-photo/shopping-cart-supermarket_23-2148879372.jpg?size=626&ext=jpg",
              distancia: id === 'user_comercio' ? "Tu comercio" : c.distancia || "1.0 km"
            }
          : c
      );
      
      const success = await saveComerciosToStorage(updatedComercios);
      if (success) {
        setComercios(updatedComercios);
        if (id === 'user_comercio') {
          const updatedUserComercio = updatedComercios.find(c => c.id === 'user_comercio');
          setMisComercio(updatedUserComercio || null);
        }
      }
      return success;
    } catch (error) {
      console.error('Error updating comercio:', error);
      return false;
    }
  };

  const deleteComercio = async (id: string): Promise<boolean> => {
    try {
      const updatedComercios = comercios.filter(c => c.id !== id);
      const success = await saveComerciosToStorage(updatedComercios);
      if (success) {
        setComercios(updatedComercios);
        if (id === 'user_comercio') {
          setMisComercio(null);
        }
      }
      return success;
    } catch (error) {
      console.error('Error deleting comercio:', error);
      return false;
    }
  };

  const getMisComercio = (): Comercio | null => {
    return misComercio;
  };

  const loadComercio = (id: string): Comercio | null => {
    return comercios.find(c => c.id === id) || null;
  };

  return (
    <ComerciosContext.Provider value={{
      comercios,
      misComercio,
      saveComercio,
      updateComercio,
      deleteComercio,
      getMisComercio,
      loadComercio,
      isLoading
    }}>
      {children}
    </ComerciosContext.Provider>
  );
};

export const useComercios = () => {
  const context = useContext(ComerciosContext);
  if (context === undefined) {
    throw new Error('useComercios must be used within a ComerciosProvider');
  }
  return context;
}; 