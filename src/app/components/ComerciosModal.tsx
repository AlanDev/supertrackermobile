import {
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  Modal,
  Linking,
  TextInput,
  Platform,
  Dimensions
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Logo } from "../../atoms/Logo";
import { useComercios } from "../context/ComerciosContext";

// Implementación segura para web con mejor fallback
const MapComponent = ({ negocios, onMarketSelect }: { negocios: any[], onMarketSelect: (market: any) => void }) => {
  const isWeb = Platform.OS === 'web';
  
  if (isWeb) {
    return (
      <View className="h-[65vh] rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200">
        <View className="p-6 h-full">
          <View className="flex-row items-center mb-4">
            <Ionicons name="map-outline" size={24} color="#3B82F6" />
            <Text className="text-lg font-semibold text-blue-800 ml-2">
              Comercios Cercanos
            </Text>
          </View>
          
          <Text className="text-blue-600 text-sm mb-4">
            📍 Mostrando {negocios.length} comercios en Buenos Aires
          </Text>
          
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {negocios.slice(0, 4).map((negocio) => (
              <Pressable
                key={negocio.id}
                onPress={() => onMarketSelect(negocio)}
                className="bg-white rounded-lg p-3 mb-3 border border-blue-200 shadow-sm"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 text-sm">
                      📍 {negocio.nombre}
                    </Text>
                    <Text className="text-gray-600 text-xs mt-1">
                      {negocio.direccion}
                    </Text>
                    <Text className="text-blue-600 text-xs mt-1">
                      {negocio.distancia}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text className="text-xs text-gray-600 ml-1">
                      {negocio.rating}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
          
          <Text className="text-center text-blue-500 text-xs mt-3">
            💡 En móvil verás un mapa interactivo
          </Text>
        </View>
      </View>
    );
  }

  // Para dispositivos móviles nativos
  try {
    const { default: MapView, Marker } = require('react-native-maps');
    return (
      <View className="h-[65vh] rounded-xl overflow-hidden">
        <MapView
          style={{ width: '100%', height: '100%' }}
          initialRegion={{
            latitude: -34.6037,
            longitude: -58.3816,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {negocios.map((negocio) => (
            <Marker
              key={negocio.id}
              coordinate={{
                latitude: negocio.latitude,
                longitude: negocio.longitude
              }}
              title={negocio.nombre}
              description={negocio.direccion}
              onPress={() => onMarketSelect(negocio)}
            />
          ))}
        </MapView>
      </View>
    );
  } catch (error) {
    // Fallback si react-native-maps no está disponible
    return (
      <View className="h-[65vh] rounded-xl overflow-hidden bg-gray-100 items-center justify-center">
        <Ionicons name="map-outline" size={48} color="#9CA3AF" />
        <Text className="text-gray-600 mt-4 text-center">
          Mapa no disponible
        </Text>
      </View>
    );
  }
};

interface ComerciosModalProps {
  visible: boolean;
  onClose: () => void;
}

interface Market {
  id: number;
  nombre: string;
  categoria: string;
  direccion: string;
  distancia: string;
  rating: number;
  imagenUrl: string;
  latitude: number;
  longitude: number;
  productos: Product[];
}

interface Product {
  id: number;
  nombre: string;
  precio: number;
  supermercado: string;
  market?: Market;
}

const ComerciosModal: React.FC<ComerciosModalProps> = ({ visible, onClose }) => {
  const { comercios } = useComercios();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [isAndroid] = useState(Platform.OS === 'android');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  // Comercios predefinidos
  const comerciosPredefinidos: Market[] = [
    {
      id: 1,
      nombre: "Carrefour Express",
      categoria: "Supermercado",
      direccion: "Av. Corrientes 1234",
      distancia: "0.5 km",
      rating: 4.5,
      imagenUrl: "https://img.freepik.com/free-photo/shopping-cart-supermarket_23-2148879372.jpg?size=626&ext=jpg",
      latitude: -34.6037,
      longitude: -58.3816,
      productos: [
        { id: 1, nombre: "Leche Serenissima", precio: 1800, supermercado: "Carrefour Express" },
        { id: 2, nombre: "Pan 1kg", precio: 800, supermercado: "Carrefour Express" },
        { id: 3, nombre: "Coca cola 2l", precio: 2500, supermercado: "Carrefour Express" }
      ]
    },
    {
      id: 2,
      nombre: "Dia Market",
      categoria: "Supermercado",
      direccion: "Av. Santa Fe 567",
      distancia: "0.8 km",
      rating: 4.2,
      imagenUrl: "https://img.freepik.com/free-photo/shopping-cart-supermarket_23-2148879372.jpg?size=626&ext=jpg",
      latitude: -34.5947,
      longitude: -58.3926,
      productos: [
        { id: 4, nombre: "Leche Serenissima", precio: 1000, supermercado: "Dia Market" },
        { id: 5, nombre: "Pan 1kg", precio: 1500, supermercado: "Dia Market" },
        { id: 6, nombre: "Coca cola 2l", precio: 3700, supermercado: "Dia Market" }
      ]
    },
    {
      id: 3,
      nombre: "Coto Express",
      categoria: "Supermercado",
      direccion: "Av. Córdoba 789",
      distancia: "1.2 km",
      rating: 4.7,
      imagenUrl: "https://img.freepik.com/free-photo/shopping-cart-supermarket_23-2148879372.jpg?size=626&ext=jpg",
      latitude: -34.6047,
      longitude: -58.3726,
      productos: [
        { id: 7, nombre: "Leche Serenissima", precio: 1700, supermercado: "Coto Express" },
        { id: 8, nombre: "Pan 1kg", precio: 1400, supermercado: "Coto Express" },
        { id: 9, nombre: "Coca cola 2l", precio: 3500, supermercado: "Coto Express" }
      ]
    },
    {
      id: 4,
      nombre: "Jumbo Express",
      categoria: "Supermercado",
      direccion: "Av. Callao 456",
      distancia: "1.5 km",
      rating: 4.8,
      imagenUrl: "https://img.freepik.com/free-photo/shopping-cart-supermarket_23-2148879372.jpg?size=626&ext=jpg",
      latitude: -34.6137,
      longitude: -58.3916,
      productos: [
        { id: 10, nombre: "Leche Serenissima", precio: 1500, supermercado: "Jumbo Express" },
        { id: 11, nombre: "Pan 1kg", precio: 1200, supermercado: "Jumbo Express" },
        { id: 12, nombre: "Manteca Serenissima", precio: 2500, supermercado: "Jumbo Express" },
        { id: 13, nombre: "Coca cola 2l", precio: 3000, supermercado: "Jumbo Express" }
      ]
    }
  ];

  // Convertir comercios del contexto al formato Market
  const comerciosUsuario: Market[] = comercios.map((comercio, index) => ({
    id: comercio.id === 'user_comercio' ? 1000 : 1000 + index, // IDs únicos para comercios de usuario
    nombre: comercio.nombre,
    categoria: comercio.categoria || 'Comercio',
    direccion: comercio.direccion,
    distancia: comercio.distancia || 'Tu comercio',
    rating: comercio.rating || 4.5,
    imagenUrl: comercio.imagenUrl || "https://img.freepik.com/free-photo/shopping-cart-supermarket_23-2148879372.jpg?size=626&ext=jpg",
    latitude: comercio.latitude || -34.6037,
    longitude: comercio.longitude || -58.3816,
    productos: comercio.productos.map((producto, pIndex) => {
      // Mejorar la conversión de precios
      const precioNumerico = parseFloat(producto.price.toString().replace(/[^\d.-]/g, ''));
      return {
        id: parseInt(producto.id) || 1000 + index * 100 + pIndex,
        nombre: producto.name,
        precio: isNaN(precioNumerico) ? 0 : precioNumerico,
        supermercado: comercio.nombre
      };
    })
  }));

  // Combinar comercios predefinidos con comercios de usuario
  const negocios: Market[] = [...comerciosPredefinidos, ...comerciosUsuario];

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      const results: Product[] = [];
      negocios.forEach(market => {
        market.productos.forEach(product => {
          if (product.nombre.toLowerCase().includes(text.toLowerCase())) {
            results.push({
              ...product,
              market: market
            });
          }
        });
      });
      
      // Debug: mostrar precios en consola
      console.log('Resultados de búsqueda:', results.map(r => ({
        nombre: r.nombre,
        precio: r.precio,
        tipo: typeof r.precio,
        supermercado: r.supermercado
      })));
      
      // Aplicar ordenamiento por precio
      const sortedResults = applySorting(results);
      setSearchResults(sortedResults);
    } else {
      setSearchResults([]);
    }
  };

  const applySorting = (results: Product[]) => {
    if (sortOrder === 'asc') {
      return [...results].sort((a, b) => {
        // Asegurar que los precios sean números válidos
        const precioA = Number(a.precio) || 0;
        const precioB = Number(b.precio) || 0;
        return precioA - precioB;
      });
    } else if (sortOrder === 'desc') {
      return [...results].sort((a, b) => {
        const precioA = Number(a.precio) || 0;
        const precioB = Number(b.precio) || 0;
        return precioB - precioA;
      });
    }
    return results;
  };

  const handleSortChange = (newSortOrder: 'none' | 'asc' | 'desc') => {
    setSortOrder(newSortOrder);
    if (searchResults.length > 0) {
      const sortedResults = applySorting(searchResults);
      setSearchResults(sortedResults);
    }
  };

  // Efecto para resetear filtros cuando se abre el modal
  useEffect(() => {
    if (visible) {
      setSortOrder('none');
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [visible]);

  const handleNavigateToMarket = (market: Market) => {
    const url = Platform.select({
      ios: `maps://app?daddr=${market.latitude},${market.longitude}&q=${encodeURIComponent(market.nombre)}`,
      android: `google.navigation:q=${market.latitude},${market.longitude}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${market.latitude},${market.longitude}&travelmode=driving`
    });
    
    Linking.canOpenURL(url!).then((supported) => {
      if (supported) {
        Linking.openURL(url!);
      } else {
        // Fallback para navegadores web o si no hay app de mapas
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${market.latitude},${market.longitude}&travelmode=driving`;
        Linking.openURL(webUrl);
      }
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black bg-opacity-50">
        <View className="flex-1 bg-purple-50">
          <View className="flex-1 px-6">
            {/* Header */}
            <View className="pt-8 pb-4">
              <View className="flex-row items-center justify-between">
                <Logo/>
                <Pressable onPress={onClose}>
                  <Ionicons name="close" size={24} color="#8b5cf6" />
                </Pressable>
              </View>
              <Text className="font-semibold text-2xl text-gray-800 mt-4">
                Comercios cercanos
              </Text>
            </View>

            {/* Buscador y resultados */}
            <View className="mb-4">
              <View className="flex-row items-center bg-white rounded-xl border border-purple-200 px-4 py-3 shadow-sm">
                <Ionicons name="search" size={20} color="#8b5cf6" />
                <TextInput
                  className="flex-1 ml-2 text-gray-700 text-base"
                  placeholder="Buscar productos..."
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={handleSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  style={{ color: '#1f2937' }}
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => handleSearch("")}>
                    <Ionicons name="close-circle" size={20} color="#9ca3af" />
                  </Pressable>
                )}
              </View>

              {/* Resultados de búsqueda */}
              {searchResults.length > 0 && (
                <View className="mt-4 bg-white rounded-xl p-4 shadow-sm">
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="font-semibold text-lg text-gray-800">
                      Resultados de búsqueda ({searchResults.length})
                    </Text>
                  </View>

                  {/* Filtros de precio */}
                  <View className="mb-4">
                    <Text className="text-gray-600 font-medium mb-2">Ordenar por precio:</Text>
                    <View className="flex-row space-x-2">
                      <Pressable
                        onPress={() => handleSortChange('none')}
                        className={`px-3 py-2 rounded-lg border ${
                          sortOrder === 'none' 
                            ? 'bg-purple-100 border-purple-500' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <Text className={`text-sm font-medium ${
                          sortOrder === 'none' ? 'text-purple-700' : 'text-gray-600'
                        }`}>
                          Sin orden
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => handleSortChange('asc')}
                        className={`px-3 py-2 rounded-lg border flex-row items-center ${
                          sortOrder === 'asc' 
                            ? 'bg-green-100 border-green-500' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <Ionicons 
                          name="arrow-up" 
                          size={14} 
                          color={sortOrder === 'asc' ? '#059669' : '#6B7280'} 
                        />
                        <Text className={`text-sm font-medium ml-1 ${
                          sortOrder === 'asc' ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          Menor precio
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => handleSortChange('desc')}
                        className={`px-3 py-2 rounded-lg border flex-row items-center ${
                          sortOrder === 'desc' 
                            ? 'bg-red-100 border-red-500' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <Ionicons 
                          name="arrow-down" 
                          size={14} 
                          color={sortOrder === 'desc' ? '#DC2626' : '#6B7280'} 
                        />
                        <Text className={`text-sm font-medium ml-1 ${
                          sortOrder === 'desc' ? 'text-red-700' : 'text-gray-600'
                        }`}>
                          Mayor precio
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                                      <ScrollView className="max-h-48">
                      {searchResults.map((product, index) => {
                        // Función mejorada para determinar si es el mismo producto
                        const isSimilarProduct = (prod1: Product, prod2: Product) => {
                          const name1 = prod1.nombre.toLowerCase().trim();
                          const name2 = prod2.nombre.toLowerCase().trim();
                          
                          // Comparación exacta
                          if (name1 === name2) return true;
                          
                          // Comparación por palabras clave principales
                          const keywords1 = name1.split(' ').filter(word => word.length > 2);
                          const keywords2 = name2.split(' ').filter(word => word.length > 2);
                          
                          // Si comparten al menos 2 palabras clave, considerarlo similar
                          const commonWords = keywords1.filter(word => keywords2.includes(word));
                          return commonWords.length >= Math.min(2, Math.min(keywords1.length, keywords2.length));
                        };
                        
                        // Buscar productos similares
                        const productosDelMismoTipo = searchResults.filter(p => 
                          isSimilarProduct(p, product)
                        );
                        
                        const preciosDelMismoTipo = productosDelMismoTipo
                          .map(p => Number(p.precio) || 0)
                          .filter(precio => precio > 0);
                        
                        const precioMinimo = preciosDelMismoTipo.length > 0 ? Math.min(...preciosDelMismoTipo) : 0;
                        const precioActual = Number(product.precio) || 0;
                        
                        const isLowestPrice = productosDelMismoTipo.length > 1 && 
                          precioActual > 0 && 
                          precioActual === precioMinimo;

                        return (
                          <View
                            key={`${product.id}-${index}`}
                            className={`p-4 rounded-xl mb-2 border ${
                              isLowestPrice 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-purple-50 border-purple-100'
                            }`}
                          >
                            <View className="flex-row items-start justify-between">
                              <View className="flex-1">
                                <Text className="font-medium text-gray-800 text-lg">{product.nombre}</Text>
                                {isLowestPrice && (
                                  <View className="flex-row items-center mt-1">
                                    <Ionicons name="trophy" size={14} color="#059669" />
                                    <Text className="text-green-600 text-xs font-semibold ml-1">
                                      ¡Mejor precio!
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                            
                            <View className="flex-row justify-between items-center mt-2">
                              <View className="flex-row items-center">
                                <View className={`px-3 py-1 rounded-full ${
                                  isLowestPrice ? 'bg-green-200' : 'bg-purple-100'
                                }`}>
                                  <Text className={`font-bold ${
                                    isLowestPrice ? 'text-green-700' : 'text-purple-600'
                                  }`}>
                                    ${product.precio}
                                  </Text>
                                </View>
                              </View>
                              <View className="flex-row items-center">
                                <Ionicons name="storefront-outline" size={16} color="#8b5cf6" />
                                <Text className="text-gray-600 ml-1">{product.supermercado}</Text>
                              </View>
                            </View>
                                                    <Pressable
                              onPress={() => product.market && setSelectedMarket(product.market)}
                              className="mt-3 bg-purple-600 py-2 px-4 rounded-lg flex-row items-center justify-center"
                            >
                              <Ionicons name="navigate" size={20} color="white" />
                              <Text className="text-white font-semibold ml-2">
                                Ir a {product.supermercado}
                              </Text>
                            </Pressable>
                          </View>
                        );
                      })}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Mapa y botón de navegación */}
            <View className="flex-1 relative">
              <MapComponent 
                negocios={negocios} 
                onMarketSelect={setSelectedMarket}
              />
              
              {/* Botón de navegación */}
              {selectedMarket && (
                <View className="absolute bottom-4 left-0 right-0 px-6">
                  <Pressable
                    onPress={() => handleNavigateToMarket(selectedMarket)}
                    className="bg-purple-600 py-4 px-6 rounded-xl flex-row items-center justify-center shadow-lg"
                  >
                    <Ionicons name="navigate" size={24} color="white" />
                    <Text className="text-white font-semibold text-lg ml-2">
                      Ir a {selectedMarket.nombre}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ComerciosModal; 