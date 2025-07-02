import {
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  AppState,
  AppStateStatus,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Logo } from "../../atoms/Logo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { LoginRequired } from "../components/LoginRequired";

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
  const [searchText, setSearchText] = useState('');
  const [filterSupermarket, setFilterSupermarket] = useState('Todos');
  const [sortBy, setSortBy] = useState<'fecha' | 'total' | 'productos'>('fecha');
  const appState = useRef(AppState.currentState);


  useEffect(() => {
    if (isLoggedIn) {
      loadPurchases();
      
      const subscription = AppState.addEventListener("change", handleAppStateChange);
      
      return () => {
        subscription.remove();
      };
    }
  }, [isLoggedIn]);
  
  useFocusEffect(
    React.useCallback(() => {
      if (isLoggedIn) {
        loadPurchases();
      }
      return () => {};
    }, [isLoggedIn])
  );

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      loadPurchases();
    }
    appState.current = nextAppState;
  };

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const savedPurchases = await AsyncStorage.getItem('purchases');
      if (savedPurchases) {
        let parsedPurchases: Compra[] = JSON.parse(savedPurchases);
        
        const normalizeDate = (dateStr: string): string => {
          if (!dateStr) return new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
          
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
            return dateStr;
          }
          
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}/${month}/${year}`;
          }
          
            return new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        };

        parsedPurchases = parsedPurchases.map(compra => ({
          ...compra,
          fecha: normalizeDate(compra.fecha)
        }));

        await AsyncStorage.setItem('purchases', JSON.stringify(parsedPurchases));
        
        parsedPurchases.sort((a, b) => b.id - a.id);
        setCompras(parsedPurchases);
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePurchase = async (purchaseId: number) => {
    Alert.alert(
      'Eliminar Compra',
      '¿Estás seguro de que deseas eliminar esta compra del historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const filteredPurchases = compras.filter(c => c.id !== purchaseId);
              await AsyncStorage.setItem('purchases', JSON.stringify(filteredPurchases));
              setCompras(filteredPurchases);
            } catch (error) {
              console.error('Error deleting purchase:', error);
              Alert.alert('Error', 'No se pudo eliminar la compra');
            }
          }
        }
      ]
    );
  };

  const uniqueSupermarkets = ['Todos', ...new Set(compras.map(c => c.supermarket))];

  const filteredAndSortedCompras = compras
    .filter(compra => {
      const matchesSearch = compra.productos.some(p => 
        p.nombre.toLowerCase().includes(searchText.toLowerCase())
      ) || compra.supermarket.toLowerCase().includes(searchText.toLowerCase());
      const matchesSupermarket = filterSupermarket === 'Todos' || compra.supermarket === filterSupermarket;
      return matchesSearch && matchesSupermarket;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'total':
          return b.total - a.total;
        case 'productos':
          return b.productos.length - a.productos.length;
        default:
          return b.id - a.id;
      }
    });

  const totalGastado = compras.reduce((sum, compra) => sum + compra.total, 0);
  const promedioCompra = compras.length > 0 ? totalGastado / compras.length : 0;
  const supermercadoFavorito = uniqueSupermarkets.slice(1).reduce((fav, supermarket) => {
    const countFav = compras.filter(c => c.supermarket === fav).length;
    const countCurrent = compras.filter(c => c.supermarket === supermarket).length;
    return countCurrent > countFav ? supermarket : fav;
  }, uniqueSupermarkets[1] || '');

  if (!isLoggedIn) {
    return <LoginRequired feature="historial de compras" />;
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-50">
        <Text className="text-purple-600 text-lg">Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-purple-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
        <Logo/>

          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              🧾 Historial de Compras
            </Text>
            <Text className="text-gray-600">
              Revisa y analiza todas tus compras anteriores
            </Text>
          </View>

          {compras.length > 0 && (
            <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">📊 Resumen</Text>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-purple-600">{compras.length}</Text>
                  <Text className="text-sm text-gray-600">Compras</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-green-600">${totalGastado.toFixed(0)}</Text>
                  <Text className="text-sm text-gray-600">Total gastado</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-blue-600">${promedioCompra.toFixed(0)}</Text>
                  <Text className="text-sm text-gray-600">Promedio</Text>
                </View>
              </View>
              {supermercadoFavorito && (
                <View className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <Text className="text-purple-700 font-medium text-center">
                    🏪 Supermercado favorito: {supermercadoFavorito}
                  </Text>
                </View>
              )}
            </View>
          )}

          <View className="mb-6">
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
              <View className="flex-row items-center">
                <Ionicons name="search-outline" size={20} color="#9CA3AF" />
                <TextInput
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Buscar por producto o supermercado..."
                  className="flex-1 ml-3 text-base text-gray-900"
                />
              </View>
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-2">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row space-x-2">
                    {uniqueSupermarkets.map((supermarket) => (
                      <Pressable
                        key={supermarket}
                        onPress={() => setFilterSupermarket(supermarket)}
                        className={`px-3 py-2 rounded-full ${
                          filterSupermarket === supermarket 
                            ? 'bg-purple-500' 
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <Text className={`text-sm font-medium ${
                          filterSupermarket === supermarket 
                            ? 'text-white' 
                            : 'text-gray-600'
                        }`}>
                          {supermarket}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>

            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-3">Ordenar por:</Text>
              <View className="flex-row space-x-3">
                {[
                  { key: 'fecha', label: 'Fecha', icon: 'calendar-outline' },
                  { key: 'total', label: 'Total', icon: 'cash-outline' },
                  { key: 'productos', label: 'Productos', icon: 'bag-outline' }
                ].map((option) => (
                  <Pressable
                    key={option.key}
                    onPress={() => setSortBy(option.key as any)}
                    className={`flex-1 flex-row items-center justify-center px-3 py-2 rounded-lg ${
                      sortBy === option.key 
                        ? 'bg-purple-100 border border-purple-300' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <Ionicons 
                      name={option.icon as any} 
                      size={16} 
                      color={sortBy === option.key ? '#8B5CF6' : '#6B7280'} 
                    />
                    <Text className={`ml-2 text-sm font-medium ${
                      sortBy === option.key ? 'text-purple-600' : 'text-gray-600'
                    }`}>
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {filteredAndSortedCompras.length === 0 ? (
            <View className="bg-white shadow-sm border border-gray-100 rounded-xl p-8 items-center">
              {searchText || filterSupermarket !== 'Todos' ? (
                <>
                  <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                    <Ionicons name="search-outline" size={40} color="#6B7280" />
                  </View>
                  <Text className="text-xl font-semibold text-gray-900 mb-2">
                    No se encontraron compras
                  </Text>
                  <Text className="text-gray-600 text-center mb-4">
                    Intenta con otros términos de búsqueda o filtros
                  </Text>
                  <Pressable
                    onPress={() => {
                      setSearchText('');
                      setFilterSupermarket('Todos');
                    }}
                    className="bg-purple-100 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-purple-600 font-medium">Limpiar filtros</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
                    <Ionicons name="receipt-outline" size={40} color="#8B5CF6" />
                  </View>
                  <Text className="text-xl font-semibold text-gray-900 mb-2">
                    No hay compras registradas
                  </Text>
                  <Text className="text-gray-600 text-center">
                    Las compras aparecerán aquí cuando agregues productos desde la pantalla principal
                  </Text>
                </>
              )}
            </View>
          ) : (
            filteredAndSortedCompras.map((compra) => (
              <View key={compra.id} className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 mb-4">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="calendar-outline" size={16} color="#8B5CF6" />
                      <Text className="font-bold text-lg text-gray-800 ml-2">{compra.fecha}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="storefront-outline" size={16} color="#6B7280" />
                      <Text className="text-gray-600 ml-2">{compra.supermarket}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <View className="bg-green-50 px-3 py-2 rounded-full mr-3">
                      <Text className="text-green-700 font-bold text-lg">${compra.total}</Text>
                    </View>
                    <Pressable
                      onPress={() => deletePurchase(compra.id)}
                      className="bg-red-50 border border-red-200 rounded-lg p-2"
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </Pressable>
                  </View>
                </View>
                
                <View className="border-t border-gray-100 pt-3">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-sm font-medium text-gray-700">Productos ({compra.productos.length})</Text>
                    <View className="flex-row items-center">
                      <Ionicons name="bag-outline" size={14} color="#6B7280" />
                      <Text className="text-sm text-gray-500 ml-1">
                        Total de artículos: {compra.productos.reduce((sum, p) => sum + parseInt(p.cantidad), 0)}
                      </Text>
                    </View>
                  </View>
                  {compra.productos.slice(0, 3).map((producto, index) => (
                    <View key={index} className="flex-row justify-between items-center mb-2">
                      <Text className="text-gray-700 flex-1">{producto.nombre}</Text>
                      <View className="flex-row items-center">
                        <Text className="text-gray-500 text-sm mr-2">x{producto.cantidad}</Text>
                        <Text className="text-purple-600 font-medium">${producto.price}</Text>
                      </View>
                    </View>
                  ))}
                  {compra.productos.length > 3 && (
                    <Text className="text-purple-600 text-sm font-medium">
                      +{compra.productos.length - 3} productos más
                    </Text>
                  )}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
    </View>
  );
};

export default historial;
