import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { LoginRequired } from '../components/LoginRequired';

interface ListaCompra {
  id: string;
  nombre: string;
  fecha: string;
  productos: ProductoLista[];
  completada: boolean;
  total: number;
}

interface ProductoLista {
  id: string;
  nombre: string;
  cantidad: number;
  precio?: number;
  comprado: boolean;
  categoria: string;
}

export default function ListaComprasScreen() {
  const { isLoggedIn } = useAuth();
  const [listas, setListas] = useState<ListaCompra[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [nombreLista, setNombreLista] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadListas();
  }, []);

  const loadListas = async () => {
    try {
      const savedListas = await AsyncStorage.getItem('shopping_lists');
      if (savedListas) {
        setListas(JSON.parse(savedListas));
      }
    } catch (error) {
      console.error('Error loading lists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveListas = async (newListas: ListaCompra[]) => {
    try {
      await AsyncStorage.setItem('shopping_lists', JSON.stringify(newListas));
      setListas(newListas);
    } catch (error) {
      console.error('Error saving lists:', error);
    }
  };

  const crearLista = async () => {
    if (!nombreLista.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la lista');
      return;
    }

    const nuevaLista: ListaCompra = {
      id: Date.now().toString(),
      nombre: nombreLista,
      fecha: new Date().toLocaleDateString(),
      productos: [],
      completada: false,
      total: 0
    };

    const listasActualizadas = [...listas, nuevaLista];
    await saveListas(listasActualizadas);
    setNombreLista('');
    setShowModal(false);
  };

  const eliminarLista = (id: string) => {
    Alert.alert(
      'Eliminar Lista',
      '¿Estás seguro de que deseas eliminar esta lista?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const listasActualizadas = listas.filter(lista => lista.id !== id);
            await saveListas(listasActualizadas);
          }
        }
      ]
    );
  };

  const verDetalleLista = (lista: ListaCompra) => {
    // Aquí navegaríamos a la pantalla de detalle
    router.push(`/shopping-list/${lista.id}` as any);
  };

  if (!isLoggedIn) {
    return <LoginRequired feature="las listas de compra" />;
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-50">
        <Text className="text-purple-600 text-lg">Cargando listas...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-purple-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <View>
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Mis Listas
              </Text>
              <Text className="text-gray-600">
                Organiza tus compras de manera inteligente
              </Text>
            </View>
            <Pressable
              onPress={() => setShowModal(true)}
              className="bg-purple-500 w-12 h-12 rounded-full items-center justify-center shadow-lg"
            >
              <Ionicons name="add" size={24} color="white" />
            </Pressable>
          </View>

          {/* Stats Cards */}
          <View className="flex-row justify-between mb-6">
            <View className="bg-white rounded-xl p-4 flex-1 mr-3 shadow-sm border border-purple-100">
              <Text className="text-purple-600 text-sm font-semibold">TOTAL LISTAS</Text>
              <Text className="text-2xl font-bold text-gray-900">{listas.length}</Text>
            </View>
            <View className="bg-white rounded-xl p-4 flex-1 ml-3 shadow-sm border border-purple-100">
              <Text className="text-purple-600 text-sm font-semibold">COMPLETADAS</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {listas.filter(l => l.completada).length}
              </Text>
            </View>
          </View>

          {/* Lista de Listas */}
          {listas.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 items-center">
              <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="list-outline" size={40} color="#8B5CF6" />
              </View>
              <Text className="text-xl font-semibold text-gray-900 mb-2">
                No tienes listas de compra
              </Text>
              <Text className="text-gray-600 text-center mb-6">
                Crea tu primera lista para organizar mejor tus compras
              </Text>
              <Pressable
                onPress={() => setShowModal(true)}
                className="bg-purple-500 px-6 py-3 rounded-xl"
              >
                <Text className="text-white font-semibold">Crear Primera Lista</Text>
              </Pressable>
            </View>
          ) : (
            <View className="space-y-4">
              {listas.map((lista) => (
                <Pressable
                  key={lista.id}
                  onPress={() => verDetalleLista(lista)}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900 mb-1">
                        {lista.nombre}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        Creada el {lista.fecha}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      {lista.completada && (
                        <View className="bg-green-100 px-3 py-1 rounded-full mr-3">
                          <Text className="text-green-700 text-xs font-semibold">
                            COMPLETADA
                          </Text>
                        </View>
                      )}
                      <Pressable
                        onPress={() => eliminarLista(lista.id)}
                        className="p-2"
                      >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      </Pressable>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="bag-outline" size={16} color="#8B5CF6" />
                      <Text className="text-gray-600 text-sm ml-1">
                        {lista.productos.length} productos
                      </Text>
                    </View>
                    {lista.total > 0 && (
                      <Text className="text-purple-600 font-semibold">
                        ${lista.total.toFixed(2)}
                      </Text>
                    )}
                  </View>

                  {/* Progress bar */}
                  {lista.productos.length > 0 && (
                    <View className="mt-3">
                      <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                        <View
                          className="bg-purple-500 h-full"
                          style={{
                            width: `${(lista.productos.filter(p => p.comprado).length / lista.productos.length) * 100}%`
                          }}
                        />
                      </View>
                      <Text className="text-xs text-gray-500 mt-1">
                        {lista.productos.filter(p => p.comprado).length} de {lista.productos.length} comprados
                      </Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal para crear lista */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-6">
          <View className="bg-white rounded-xl p-6 w-full max-w-md">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-900">Nueva Lista</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>

            <TextInput
              value={nombreLista}
              onChangeText={setNombreLista}
              placeholder="Nombre de la lista (ej: Compras del lunes)"
              className="bg-gray-100 rounded-xl px-4 py-4 text-base mb-6"
              autoFocus
            />

            <View className="flex-row space-x-3">
              <Pressable
                onPress={() => setShowModal(false)}
                className="flex-1 bg-gray-200 py-4 rounded-xl"
              >
                <Text className="text-gray-700 text-center font-semibold">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={crearLista}
                className="flex-1 bg-purple-500 py-4 rounded-xl"
              >
                <Text className="text-white text-center font-semibold">Crear Lista</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
} 