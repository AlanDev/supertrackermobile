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
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  const micomercio=()=>{
    router.push("/pages/micomercio" as any)
  }

  return (
    <View className="flex-1 bg-purple-50">
      <ScrollView showsVerticalScrollIndicator={true} className="flex-1">
        <View className="px-6 py-8">
          <Text className="font-semibold text-2xl text-gray-800 mb-6">Mi Perfil</Text>

          {/* Perfil de usuario mejorado */}
          <View className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <View className="flex-row items-center mb-6">
              <View className="h-20 w-20 rounded-full bg-purple-200 justify-center items-center mr-4">
                <Ionicons name="person" size={36} color="#8B5CF6" />
              </View>
              <View>
                <Text className="text-xl font-semibold text-gray-800">{userData.name}</Text>
                <Text className="text-gray-500">{userData.email}</Text>
                <Text className="text-xs text-gray-400 mt-1">Miembro desde: {userData.memberSince}</Text>
              </View>
            </View>
            
            {/* Estadísticas de usuario */}
            <View className="flex-row justify-between mb-2">
              <View className="bg-purple-50 rounded-xl p-3 flex-1 mr-2">
                <Text className="text-gray-500 text-xs mb-1">Compras totales</Text>
                <Text className="text-lg font-bold text-purple-600">{userData.totalPurchases}</Text>
              </View>
              
            </View>
            
            {/* Supermercado favorito */}
            <View className="bg-blue-50 rounded-xl p-3 mt-2">
              <Text className="text-gray-500 text-xs mb-1">Supermercado favorito</Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text className="text-lg font-bold text-blue-600 ml-1">{userData.favoriteSupermarket}</Text>
              </View>
            </View>
          </View>

          {/* Menú de opciones */}
          <View className="bg-white rounded-xl shadow-sm">
            <Pressable className="flex-row items-center justify-between border-b border-gray-100 p-4">
              <View className="flex-row items-center">
                <Ionicons name="wallet-outline" size={24} color="#8B5CF6" className="mr-3" />
                <Text className="text-gray-700 ml-3">Mis compras</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="gray" />
            </Pressable>

            <Pressable className="flex-row items-center justify-between border-b border-gray-100 p-4">
              <View className="flex-row items-center">
                <Ionicons name="analytics-outline" size={24} color="#8B5CF6" className="mr-3" />
                <Text className="text-gray-700 ml-3">Mis estadísticas</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="gray" />
            </Pressable>
            <Pressable 
              onPress={micomercio}
              className="flex-row items-center justify-between border-b border-gray-100 p-4"
            >
              <View className="flex-row items-center">
                <Ionicons name="bag-outline" size={24} color="#8B5CF6" className="mr-3" />
                <Text className="text-gray-700 ml-3">Mi comercio</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="gray" />
            </Pressable>

            <Pressable className="flex-row items-center justify-between border-b border-gray-100 p-4">
              <View className="flex-row items-center">
                <Ionicons name="settings-outline" size={24} color="#8B5CF6" className="mr-3" />
                <Text className="text-gray-700 ml-3">Configuración</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="gray" />
            </Pressable>

            <Pressable className="flex-row items-center justify-between border-b border-gray-100 p-4">
              <View className="flex-row items-center">
                <Ionicons name="notifications-outline" size={24} color="#8B5CF6" className="mr-3" />
                <Text className="text-gray-700 ml-3">Notificaciones</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="gray" />
            </Pressable>

            <Pressable className="flex-row items-center justify-between border-b border-gray-100 p-4">
              <View className="flex-row items-center">
                <Ionicons name="help-circle-outline" size={24} color="#8B5CF6" className="mr-3" />
                <Text className="text-gray-700 ml-3">Ayuda y Soporte</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="gray" />
            </Pressable>

            <Pressable 
              onPress={handleLogout}
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center">
                <Ionicons name="log-out-outline" size={24} color="#EF4444" className="mr-3" />
                <Text className="text-red-500 ml-3">Cerrar Sesión</Text>
              </View>
            </Pressable>
          </View>
          
          {/* Botón grande de cierre de sesión */}
          
          
          {/* Espacio adicional al final para asegurar que se pueda hacer scroll */}
          <View className="h-10"></View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserProfile; 