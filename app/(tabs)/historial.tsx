import {
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  AppState,
  AppStateStatus,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Logo from "../components/Logo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import LoginRequired from "../components/LoginRequired";

interface Compra {
  id: number;
  fecha: string;
  productos: any[];
  total: number;
  supermarket: string;
}

const historial = () => {
  const { isLoggedIn } = useAuth();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const appState = useRef(AppState.currentState);

  // Cargar historial al inicio si el usuario está autenticado
  useEffect(() => {
    if (isLoggedIn) {
      loadPurchases();
      
      // Agregar listener para el estado de la aplicación
      const subscription = AppState.addEventListener("change", handleAppStateChange);
      
      return () => {
        subscription.remove();
      };
    }
  }, [isLoggedIn]);
  
  // También actualizar cuando la pestaña obtiene el foco si el usuario está autenticado
  useFocusEffect(
    React.useCallback(() => {
      if (isLoggedIn) {
        loadPurchases();
      }
      return () => {};
    }, [isLoggedIn])
  );

  // Manejar cambios en el estado de la app
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      // App ha vuelto al primer plano
      loadPurchases();
    }
    appState.current = nextAppState;
  };

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const savedPurchases = await AsyncStorage.getItem('purchases');
      if (savedPurchases) {
        // Ordenar por fecha/ID (más recientes primero)
        const parsedPurchases: Compra[] = JSON.parse(savedPurchases);
        parsedPurchases.sort((a, b) => b.id - a.id);
        setCompras(parsedPurchases);
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  // Si el usuario no está autenticado, mostrar el componente LoginRequired
  if (!isLoggedIn) {
    return <LoginRequired feature="historial de compras" />;
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-50">
        <Text>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-purple-50 flex-1">
      <View className="flex-1 px-6 py-8">
        <Logo/>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="font-semibold text-2xl text-gray-800">Historial de Compras</Text>
        </View>

        {compras.length === 0 ? (
          <View className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 mb-4">
            <Text className="text-center text-gray-500">No hay compras registradas</Text>
          </View>
        ) : (
          compras.map((compra) => (
            <View key={compra.id} className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-bold text-lg text-gray-800">{compra.fecha}</Text>
                <View className="bg-purple-50 px-3 py-1 rounded-full">
                  <Text className="text-purple-700 font-medium">${compra.total}</Text>
                </View>
              </View>
              
              <Text className="text-gray-600 mb-3">{compra.supermarket}</Text>
              
              <View className="border-t border-gray-100 pt-3">
                {compra.productos.map((producto, index) => (
                  <View key={index} className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-700">{producto.nombre}</Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-gray-500">x{producto.cantidad}</Text>
                      <Text className="text-green-600">${producto.price}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default historial;
