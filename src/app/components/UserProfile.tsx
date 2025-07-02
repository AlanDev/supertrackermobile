import { View, Text, Image, Pressable, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Voy a crear un tipo para las props que incluya una función para actualizar el estado de login
interface UserProfileProps {
  onLogout?: () => void;
}

const UserProfile = ({ onLogout }: UserProfileProps) => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "Usuario Demo",
    email: "ejemplo@gmail.com",
    memberSince: "01/01/2023",
    totalPurchases: 24,
    favoriteSupermarket: "Carrefour",
    savedMoney: 2850
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener datos del usuario
    const getUserData = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        setIsLoading(false);
        
        // Si el usuario es el demo, ya tenemos los datos
        if (email === 'ejemplo@gmail.com') {
          return; // Usar los datos predeterminados
        }
        
        // Aquí podríamos cargar datos personalizados de otro usuario si fuera necesario
      } catch (error) {
        console.log('Error loading user data:', error);
        setIsLoading(false);
      }
    };
    
    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear user credentials from AsyncStorage
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userPassword');
      await AsyncStorage.removeItem('userLoggedIn');
      
      // Alerta de éxito
      alert("Sesión cerrada con éxito");
      
      // En lugar de navegar, llamamos a la función que actualiza el estado en el componente padre
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.log('Error logging out:', error);
      alert("Error al cerrar sesión");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-50">
        <Text className="text-purple-600 text-lg">Cargando perfil...</Text>
      </View>
    );
  }

  const misComercios=()=>{
    router.push("/pages/mis-comercios" as any)
  }

  return (
    <View className="flex-1 bg-purple-50">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 py-8">
          {/* Header con título mejorado */}
          <View className="mb-8">
            <Text className="font-bold text-3xl text-gray-900 mb-2">Mi Perfil</Text>
            <Text className="text-gray-500 text-base">Gestiona tu información y preferencias</Text>
          </View>

          {/* Tarjeta de perfil principal mejorada */}
          <View className="bg-white rounded-2xl p-6 shadow-lg mb-8 border border-gray-100">
            <View className="flex-row items-center mb-6">
              {/* Avatar con gradiente */}
              <View className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 justify-center items-center mr-5 shadow-lg">
                <Ionicons name="person" size={40} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-1">{userData.name}</Text>
                <Text className="text-purple-600 text-base font-medium mb-1">{userData.email}</Text>
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                  <Text className="text-gray-500 text-sm ml-1">Miembro desde {userData.memberSince}</Text>
                </View>
              </View>
            </View>
            
            {/* Estadísticas mejoradas */}
            <View className="flex-row justify-between mb-4">
              <View className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 flex-1 mr-3 border border-purple-200">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="bag-outline" size={18} color="#8B5CF6" />
                  <Text className="text-purple-700 text-xs font-semibold ml-1">COMPRAS</Text>
                </View>
                <Text className="text-2xl font-bold text-purple-900">{userData.totalPurchases}</Text>
              </View>
              
              <View className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 flex-1 ml-3 border border-green-200">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="wallet-outline" size={18} color="#10B981" />
                  <Text className="text-green-700 text-xs font-semibold ml-1">AHORRADO</Text>
                </View>
                <Text className="text-2xl font-bold text-green-900">${userData.savedMoney}</Text>
              </View>
            </View>
            
            {/* Supermercado favorito mejorado */}
            <View className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200">
              <View className="flex-row items-center mb-2">
                <Ionicons name="star" size={18} color="#F59E0B" />
                <Text className="text-blue-700 text-xs font-semibold ml-1">SUPERMERCADO FAVORITO</Text>
              </View>
              <Text className="text-xl font-bold text-blue-900">{userData.favoriteSupermarket}</Text>
            </View>
          </View>

          {/* Menú de opciones mejorado */}
          <View className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <Pressable 
              onPress={() => router.push("/(tabs)/historial" as any)}
              className="flex-row items-center justify-between border-b border-gray-50 p-5 active:bg-gray-50"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="wallet-outline" size={20} color="#8B5CF6" />
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold text-base">Mis compras</Text>
                  <Text className="text-gray-500 text-sm">Historial de compras</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </Pressable>

            <Pressable 
              onPress={() => router.push("/(tabs)/estadisticas" as any)}
              className="flex-row items-center justify-between border-b border-gray-50 p-5 active:bg-gray-50"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="analytics-outline" size={20} color="#3B82F6" />
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold text-base">Mis estadísticas</Text>
                  <Text className="text-gray-500 text-sm">Análisis de gastos</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </Pressable>

            <Pressable 
              onPress={misComercios}
              className="flex-row items-center justify-between border-b border-gray-50 p-5 active:bg-gray-50"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="storefront-outline" size={20} color="#10B981" />
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold text-base">Mis comercios</Text>
                  <Text className="text-gray-500 text-sm">Gestionar negocios</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </Pressable>

            <Pressable 
              onPress={() => router.push("/ofertas" as any)}
              className="flex-row items-center justify-between border-b border-gray-50 p-5 active:bg-gray-50"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="gift-outline" size={20} color="#EC4899" />
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold text-base">Ofertas</Text>
                  <Text className="text-gray-500 text-sm">Descuentos disponibles</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </Pressable>

            <Pressable 
              onPress={() => router.push("/comparador" as any)}
              className="flex-row items-center justify-between border-b border-gray-50 p-5 active:bg-gray-50"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="git-compare-outline" size={20} color="#F97316" />
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold text-base">Comparador</Text>
                  <Text className="text-gray-500 text-sm">Compara precios</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </Pressable>

            <Pressable 
              onPress={() => router.push("/configuracion/ajustes" as any)}
              className="flex-row items-center justify-between border-b border-gray-50 p-5 active:bg-gray-50"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="settings-outline" size={20} color="#6B7280" />
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold text-base">Ajustes</Text>
                  <Text className="text-gray-500 text-sm">Configuración de la app</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </Pressable>

            <Pressable 
              onPress={() => router.push("/configuracion/notificaciones" as any)}
              className="flex-row items-center justify-between border-b border-gray-50 p-5 active:bg-gray-50"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="notifications-outline" size={20} color="#F59E0B" />
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold text-base">Notificaciones</Text>
                  <Text className="text-gray-500 text-sm">Gestionar alertas</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </Pressable>

            <Pressable 
              onPress={() => router.push("/(tabs)/lista-compras" as any)}
              className="flex-row items-center justify-between border-b border-gray-50 p-5 active:bg-gray-50"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="help-circle-outline" size={20} color="#6366F1" />
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold text-base">Mis Listas</Text>
                  <Text className="text-gray-500 text-sm">Listas de compras</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </Pressable>

            <Pressable 
              onPress={handleLogout}
              className="flex-row items-center justify-between p-5 active:bg-red-50"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                </View>
                <View>
                  <Text className="text-red-600 font-semibold text-base">Cerrar Sesión</Text>
                  <Text className="text-red-400 text-sm">Salir de la aplicación</Text>
                </View>
              </View>
            </Pressable>
          </View>
          
          {/* Espacio adicional al final */}
          <View className="h-8"></View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserProfile; 