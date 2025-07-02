import {
  Text,
  View,
  Pressable,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from 'react'
import { Logo } from '../../atoms/Logo'
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useComercios, type Comercio } from "../context/ComerciosContext";

const misComercios = () => {
  const { 
    misComercios, 
    getMisComercios, 
    deleteComercio, 
    setCurrentComercio, 
    isLoading 
  } = useComercios();

  const [comercios, setComercios] = useState<Comercio[]>([]);

  useEffect(() => {
    const loadComercios = () => {
      const userComercios = getMisComercios();
      setComercios(userComercios);
    };
    loadComercios();
  }, [misComercios]);

  const logo = () => {
    router.push("/(tabs)")
  }

  const handleSelectComercio = (comercio: Comercio) => {
    setCurrentComercio(comercio.id);
    router.push("/pages/micomercio");
  }

  const handleDeleteComercio = (comercio: Comercio) => {
    Alert.alert(
      'Eliminar Comercio',
      `¿Estás seguro de que deseas eliminar "${comercio.nombre}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteComercio(comercio.id);
            if (success) {
              Alert.alert('✅ Éxito', 'Comercio eliminado correctamente');
              const updatedComercios = getMisComercios();
              setComercios(updatedComercios);
            } else {
              Alert.alert('❌ Error', 'No se pudo eliminar el comercio');
            }
          }
        }
      ]
    );
  }

  const handleCreateNew = () => {
    setCurrentComercio('');
    router.push("/pages/micomercio");
  }

  const categoriasComercio = [
    { id: 1, nombre: 'Supermercado', icono: '🛒', color: 'bg-blue-100 text-blue-700' },
    { id: 2, nombre: 'Farmacia', icono: '💊', color: 'bg-green-100 text-green-700' },
    { id: 3, nombre: 'Panadería', icono: '🍞', color: 'bg-orange-100 text-orange-700' },
    { id: 4, nombre: 'Carnicería', icono: '🥩', color: 'bg-red-100 text-red-700' },
    { id: 5, nombre: 'Verdulería', icono: '🥕', color: 'bg-green-100 text-green-700' },
    { id: 6, nombre: 'Bebidas', icono: '🥤', color: 'bg-purple-100 text-purple-700' },
    { id: 7, nombre: 'Limpieza', icono: '🧽', color: 'bg-cyan-100 text-cyan-700' },
    { id: 8, nombre: 'Otros', icono: '🏪', color: 'bg-gray-100 text-gray-700' }
  ];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-purple-50 justify-center items-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-gray-600 mt-4 font-medium">Cargando comercios...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-purple-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-8">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <Pressable onPress={logo}>
              <Logo/>
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-purple-100"
            >
              <Ionicons name="close" size={24} color="#8B5CF6" />
            </Pressable>
          </View>

          {/* Título */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-purple-500 rounded-2xl items-center justify-center mr-4 shadow-lg">
                <Text className="text-3xl">🏪</Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-3xl text-gray-900 mb-1">
                  Mis Comercios
                </Text>
                <Text className="text-purple-600 text-base font-medium">
                  Gestiona todos tus negocios en un solo lugar
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Dashboard */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-4">📊 Resumen</Text>
            <View className="flex-row justify-between mb-4">
              <View className="bg-white rounded-2xl p-4 flex-1 mr-2 shadow-sm border border-purple-100">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-purple-600 text-sm font-bold">COMERCIOS</Text>
                  <Ionicons name="storefront" size={16} color="#8B5CF6" />
                </View>
                <Text className="text-2xl font-bold text-gray-900">{comercios.length}</Text>
                <Text className="text-xs text-gray-500">Total registrados</Text>
              </View>
              <View className="bg-white rounded-2xl p-4 flex-1 ml-2 shadow-sm border border-purple-100">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-green-600 text-sm font-bold">PRODUCTOS</Text>
                  <Ionicons name="cube" size={16} color="#10B981" />
                </View>
                <Text className="text-2xl font-bold text-gray-900">
                  {comercios.reduce((total, comercio) => total + comercio.productos.length, 0)}
                </Text>
                <Text className="text-xs text-gray-500">En todos los comercios</Text>
              </View>
            </View>
          </View>

          {/* Botón para crear nuevo comercio */}
          <View className="mb-6">
            <Pressable 
              onPress={handleCreateNew}
              className="bg-purple-600 rounded-2xl overflow-hidden shadow-xl"
              style={{
                shadowColor: '#8B5CF6',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <View className="p-6">
                <View className="flex-row items-center justify-center">
                  <View className="w-12 h-12 bg-white bg-opacity-20 rounded-full items-center justify-center mr-4">
                    <Text className="text-white text-2xl font-bold">✨</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-xl">
                      Crear Nuevo Comercio
                    </Text>
                    <Text className="text-purple-100 text-sm">
                      Agrega un nuevo negocio a tu lista
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          </View>

          {/* Lista de comercios */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-4">🏪 Tus Comercios</Text>
            
            {comercios.length === 0 ? (
              <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 items-center">
                <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                  <Text className="text-4xl">🏪</Text>
                </View>
                <Text className="text-gray-700 font-semibold text-lg mb-2">
                  No tienes comercios aún
                </Text>
                <Text className="text-gray-500 text-center mb-6">
                  Crea tu primer comercio para empezar a gestionar tu negocio
                </Text>
                <Pressable 
                  onPress={handleCreateNew}
                  className="bg-purple-600 px-6 py-3 rounded-xl"
                >
                  <Text className="text-white font-semibold">Crear mi primer comercio</Text>
                </Pressable>
              </View>
            ) : (
              <View className="space-y-4">
                {comercios.map((comercio) => {
                  const categoria = categoriasComercio.find(c => c.nombre === comercio.categoria);
                  return (
                    <View 
                      key={comercio.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      <View className="p-5">
                        {/* Header del comercio */}
                        <View className="flex-row items-start justify-between mb-4">
                          <View className="flex-row items-start flex-1">
                            <View className="w-12 h-12 bg-purple-100 rounded-xl items-center justify-center mr-3">
                              <Text className="text-xl">
                                {categoria?.icono || '🏪'}
                              </Text>
                            </View>
                            <View className="flex-1">
                              <Text className="font-bold text-lg text-gray-900 mb-1">
                                {comercio.nombre}
                              </Text>
                              <Text className="text-gray-600 text-sm mb-1">
                                📍 {comercio.direccion}
                              </Text>
                              {comercio.categoria && (
                                <View className="bg-purple-100 px-2 py-1 rounded-lg self-start">
                                  <Text className="text-purple-700 text-xs font-medium">
                                    {comercio.categoria}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>

                        {/* Stats del comercio */}
                        <View className="flex-row justify-between mb-4 bg-gray-50 rounded-xl p-3">
                          <View className="items-center">
                            <Text className="text-lg font-bold text-purple-600">
                              {comercio.productos.length}
                            </Text>
                            <Text className="text-xs text-gray-600">Productos</Text>
                          </View>
                          <View className="items-center">
                            <Text className="text-lg font-bold text-green-600">
                              {new Set(comercio.productos.map(p => p.category)).size}
                            </Text>
                            <Text className="text-xs text-gray-600">Categorías</Text>
                          </View>
                          <View className="items-center">
                            <Text className="text-lg font-bold text-blue-600">
                              {comercio.productos.length > 0 ? 
                                `$${Math.max(...comercio.productos.map(p => parseFloat(p.price))).toFixed(0)}` : 
                                '$0'
                              }
                            </Text>
                            <Text className="text-xs text-gray-600">Precio máx</Text>
                          </View>
                        </View>

                        {/* Botones de acción */}
                        <View className="flex-row gap-3">
                          <Pressable 
                            onPress={() => handleSelectComercio(comercio)}
                            className="flex-1 bg-purple-600 py-3 rounded-xl"
                          >
                            <View className="flex-row items-center justify-center">
                              <Ionicons name="create" size={16} color="white" />
                              <Text className="text-white font-semibold ml-2">Editar</Text>
                            </View>
                          </Pressable>
                          
                          <Pressable 
                            onPress={() => handleDeleteComercio(comercio)}
                            className="bg-red-100 border border-red-200 py-3 px-4 rounded-xl"
                          >
                            <Ionicons name="trash" size={16} color="#EF4444" />
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default misComercios 