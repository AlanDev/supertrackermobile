import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { LoginRequired } from './components/LoginRequired';

interface ProductoComparador {
  id: string;
  nombre: string;
  comercios: ComercioProducto[];
  categoria: string;
  imagen?: string;
}

interface ComercioProducto {
  comercio: string;
  precio: number;
  distancia: string;
  disponible: boolean;
  rating: number;
  descuento?: number;
}

export default function ComparadorScreen() {
  const { isLoggedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [productos, setProductos] = useState<ProductoComparador[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductoComparador | null>(null);

  useEffect(() => {
    loadProductosComparador();
  }, []);

  const loadProductosComparador = () => {
    const productosData: ProductoComparador[] = [
      {
        id: '1',
        nombre: 'Leche La Serenísima 1L',
        categoria: 'Lácteos',
        comercios: [
          { comercio: 'Carrefour Express', precio: 1800, distancia: '0.5 km', disponible: true, rating: 4.5 },
          { comercio: 'Dia Market', precio: 1650, distancia: '0.8 km', disponible: true, rating: 4.2, descuento: 10 },
          { comercio: 'Coto Express', precio: 1750, distancia: '1.2 km', disponible: true, rating: 4.7 },
          { comercio: 'Jumbo Express', precio: 1900, distancia: '1.5 km', disponible: false, rating: 4.8 }
        ]
      },
      {
        id: '2',
        nombre: 'Pan Lactal Bimbo',
        categoria: 'Panadería',
        comercios: [
          { comercio: 'Carrefour Express', precio: 1200, distancia: '0.5 km', disponible: true, rating: 4.5 },
          { comercio: 'Dia Market', precio: 1150, distancia: '0.8 km', disponible: true, rating: 4.2 },
          { comercio: 'Coto Express', precio: 1300, distancia: '1.2 km', disponible: true, rating: 4.7 },
          { comercio: 'Jumbo Express', precio: 1100, distancia: '1.5 km', disponible: true, rating: 4.8, descuento: 15 }
        ]
      },
      {
        id: '3',
        nombre: 'Coca Cola 2L',
        categoria: 'Bebidas',
        comercios: [
          { comercio: 'Carrefour Express', precio: 2500, distancia: '0.5 km', disponible: true, rating: 4.5 },
          { comercio: 'Dia Market', precio: 2300, distancia: '0.8 km', disponible: true, rating: 4.2, descuento: 8 },
          { comercio: 'Coto Express', precio: 2400, distancia: '1.2 km', disponible: true, rating: 4.7 },
          { comercio: 'Jumbo Express', precio: 2200, distancia: '1.5 km', disponible: true, rating: 4.8 }
        ]
      }
    ];
    setProductos(productosData);
  };

  const filteredProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMejorPrecio = (comercios: ComercioProducto[]) => {
    const disponibles = comercios.filter(c => c.disponible);
    if (disponibles.length === 0) return null;
    return disponibles.reduce((min, current) => 
      current.precio < min.precio ? current : min
    );
  };

  const getPrecioConDescuento = (precio: number, descuento?: number) => {
    if (descuento) {
      return precio * (1 - descuento / 100);
    }
    return precio;
  };

  if (!isLoggedIn) {
    return <LoginRequired feature="el comparador de precios" />;
  }

  return (
    <View className="flex-1 bg-purple-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          <View className="mb-8">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mb-4"
            >
              <Ionicons name="arrow-back" size={20} color="#6366F1" />
            </Pressable>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Comparador de Precios
            </Text>
            <Text className="text-gray-600">
              Encuentra los mejores precios en comercios cercanos
            </Text>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
            <View className="flex-row items-center">
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar producto..."
                className="flex-1 ml-3 text-base"
              />
            </View>
          </View>

          {filteredProducts.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 items-center">
              <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="search-outline" size={40} color="#3B82F6" />
              </View>
              <Text className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No se encontraron productos' : 'Busca un producto'}
              </Text>
              <Text className="text-gray-600 text-center">
                {searchQuery ? 'Intenta con otro término de búsqueda' : 'Escribe el nombre del producto que quieres comparar'}
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              {filteredProducts.map((producto) => {
                const mejorPrecio = getMejorPrecio(producto.comercios);
                
                return (
                  <View key={producto.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <View className="p-5 border-b border-gray-100">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="text-lg font-semibold text-gray-900 mb-1">
                            {producto.nombre}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            {producto.categoria}
                          </Text>
                        </View>
                        {mejorPrecio && (
                          <View className="bg-green-100 px-3 py-1 rounded-full">
                            <Text className="text-green-700 text-xs font-semibold">
                              MEJOR PRECIO
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                      <View className="p-5">
                      {producto.comercios.map((comercio, index) => {
                        const precioFinal = getPrecioConDescuento(comercio.precio, comercio.descuento);
                        const esMejorPrecio = mejorPrecio?.comercio === comercio.comercio;
                        
                        return (
                          <View 
                            key={index} 
                            className={`flex-row items-center justify-between py-3 ${
                              index < producto.comercios.length - 1 ? 'border-b border-gray-100' : ''
                            } ${esMejorPrecio ? 'bg-green-50 -mx-5 px-5 rounded-lg' : ''}`}
                          >
                            <View className="flex-1">
                              <View className="flex-row items-center mb-1">
                                <Text className={`font-semibold ${esMejorPrecio ? 'text-green-800' : 'text-gray-900'}`}>
                                  {comercio.comercio}
                                </Text>
                                {!comercio.disponible && (
                                  <View className="bg-red-100 px-2 py-1 rounded ml-2">
                                    <Text className="text-red-600 text-xs">No disponible</Text>
                                  </View>
                                )}
                              </View>
                              <View className="flex-row items-center">
                                <View className="flex-row items-center mr-3">
                                  <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                                  <Text className="text-xs text-gray-500 ml-1">{comercio.distancia}</Text>
                                </View>
                                <View className="flex-row items-center">
                                  <Ionicons name="star" size={12} color="#F59E0B" />
                                  <Text className="text-xs text-gray-500 ml-1">{comercio.rating}</Text>
                                </View>
                              </View>
                            </View>

                            <View className="items-end">
                              <View className="flex-row items-center">
                                {comercio.descuento && (
                                  <Text className="text-sm text-gray-400 line-through mr-2">
                                    ${comercio.precio}
                                  </Text>
                                )}
                                <Text className={`text-lg font-bold ${
                                  esMejorPrecio ? 'text-green-600' : 'text-gray-900'
                                } ${!comercio.disponible ? 'opacity-50' : ''}`}>
                                  ${precioFinal.toFixed(0)}
                                </Text>
                              </View>
                              {comercio.descuento && (
                                <View className="bg-red-100 px-2 py-1 rounded mt-1">
                                  <Text className="text-red-600 text-xs font-semibold">
                                    -{comercio.descuento}%
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        );
                      })}
                    </View>

                    {mejorPrecio && (
                      <View className="bg-gray-50 p-4">
                        <Text className="text-sm text-gray-600">
                          💡 Puedes ahorrar hasta $
                          {(Math.max(...producto.comercios.filter(c => c.disponible).map(c => getPrecioConDescuento(c.precio, c.descuento))) - 
                            getPrecioConDescuento(mejorPrecio.precio, mejorPrecio.descuento)).toFixed(0)} 
                          {' '}eligiendo el mejor precio
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
} 