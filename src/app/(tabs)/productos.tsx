import { Text, View, TextInput, Pressable, ScrollView, Modal, Dimensions, AppState, AppStateStatus, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Logo } from "../../atoms/Logo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { useFocusEffect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { LoginRequired } from "../components/LoginRequired";

interface Product {
  nombre: string;
  cantidad: string;
  price: string;
  supermarket: string;
  category: string;
  formattedDate: string;
}

interface ConsolidatedProduct {
  nombre: string;
  lastPrice: string;
  category: string;
  priceHistory: {
    price: string;
    fecha: string;
    supermarket: string;
  }[];
}

interface PriceDataPoint {
  price: number;
  fecha: string;
  formattedFecha: string;
  supermarket: string;
  color?: string;
}

const screenWidth = Dimensions.get("window").width;


const supermarketColors: {[key: string]: string} = {
  "Carrefour": "#FF6384",
  "Dia": "#36A2EB",
  "Coto": "#FFCE56",
  "Jumbo": "#4BC0C0",
  "Chango Más": "#9966FF",
  "Vea": "#FF9F40",
  "Disco": "#4BC0C0",
  "Walmart": "#36A2EB",
  "default": "#C9CBCF"
};

const productos = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [consolidatedProducts, setConsolidatedProducts] = useState<ConsolidatedProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ConsolidatedProduct | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todas');
  const appState = useRef(AppState.currentState);
  

  const [selectedDataPoint, setSelectedDataPoint] = useState<PriceDataPoint | null>(null);

  const categorias = ['Todas', 'Lácteos', 'Carnes', 'Frutas y Verduras', 'Bebidas', 'Limpieza', 'Higiene Personal', 'Panadería', 'Congelados', 'Almacén', 'Otros'];


  useEffect(() => {
    if (isLoggedIn) {
      loadProducts();
      
      const subscription = AppState.addEventListener("change", handleAppStateChange);
      
      return () => {
        subscription.remove();
      };
    }
  }, [isLoggedIn]);
  
  useFocusEffect(
    React.useCallback(() => {
      if (isLoggedIn) {
        loadProducts();
      }
      return () => {};
    }, [isLoggedIn])
  );

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      loadProducts();
    }
    appState.current = nextAppState;
  };

  const loadProducts = async () => {
    try {
      const savedProducts = await AsyncStorage.getItem('products');
      if (savedProducts) {
        let loadedProducts: Product[] = JSON.parse(savedProducts);
        

        const normalizeDate = (dateStr: string): string => {
          console.log('Normalizando fecha:', dateStr);
          
          if (!dateStr || typeof dateStr !== 'string') {
            const today = new Date();
            const result = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
            console.log('Fecha vacía, usando hoy:', result);
            return result;
          }
          
          const cleanDate = dateStr.trim();
          

          if (/^\d{2}\/\d{2}\/\d{4}$/.test(cleanDate)) {

            const [day, month, year] = cleanDate.split('/').map(n => parseInt(n));
            if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2030) {
              console.log('Fecha válida mantenida:', cleanDate);
              return cleanDate;
            }
          }
          

          if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cleanDate)) {
            const [day, month, year] = cleanDate.split('/');
            const normalizedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
            console.log('Fecha normalizada:', cleanDate, '->', normalizedDate);
            return normalizedDate;
          }
          

          const localeMatch = cleanDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
          if (localeMatch) {
            const [, day, month, year] = localeMatch;
            const result = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
            console.log('Fecha locale parseada:', cleanDate, '->', result);
            return result;
          }
          

          const date = new Date(cleanDate);
          if (!isNaN(date.getTime()) && date.getFullYear() >= 1900 && date.getFullYear() <= 2030) {
            const result = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
            console.log('Fecha parseada y convertida:', cleanDate, '->', result);
            return result;
          }
          

          const today = new Date();
          const result = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
          console.warn('No se pudo parsear fecha, usando hoy:', cleanDate, '->', result);
          return result;
        };


        loadedProducts = loadedProducts.map(product => ({
          ...product,
          formattedDate: normalizeDate(product.formattedDate)
        }));


        await AsyncStorage.setItem('products', JSON.stringify(loadedProducts));
        
        setProducts(loadedProducts);
        
        const productMap = new Map<string, ConsolidatedProduct>();
        

        const parseDate = (dateStr: string): Date => {
          if (!dateStr) return new Date();
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            const [day, month, year] = parts;
            return new Date(`${month}/${day}/${year}`);
          }
          const date = new Date(dateStr);
          return isNaN(date.getTime()) ? new Date() : date;
        };
        
        loadedProducts.forEach(product => {
          const key = product.nombre.toLowerCase();
          
          if (!productMap.has(key)) {
            productMap.set(key, {
              nombre: product.nombre,
              lastPrice: product.price,
              category: product.category,
              priceHistory: [{
                price: product.price,
                fecha: product.formattedDate,
                supermarket: product.supermarket
              }]
            });
          } else {
            const existing = productMap.get(key)!;
            
            existing.priceHistory.push({
              price: product.price,
              fecha: product.formattedDate,
              supermarket: product.supermarket
            });
            
            existing.priceHistory.sort((a, b) => {
              return parseDate(b.fecha).getTime() - parseDate(a.fecha).getTime();
            });
            
            existing.lastPrice = existing.priceHistory[0].price;
          }
        });
        
        setConsolidatedProducts(Array.from(productMap.values()));
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const deleteProduct = async (productName: string) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de que deseas eliminar todos los registros de "${productName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
        
              const filteredProducts = products.filter(p => 
                p.nombre.toLowerCase() !== productName.toLowerCase()
              );
              
        
              await AsyncStorage.setItem('products', JSON.stringify(filteredProducts));
              
        
              loadProducts();
              
        
              if (selectedProduct && selectedProduct.nombre.toLowerCase() === productName.toLowerCase()) {
                setModalVisible(false);
                setSelectedProduct(null);
              }
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          }
        }
      ]
    );
  };

  const viewProductDetails = (product: ConsolidatedProduct) => {
    setSelectedProduct(product);
    setSelectedDataPoint(null);
    setModalVisible(true);
  };

  const getChartData = (product: ConsolidatedProduct) => {

    const parseDate = (dateStr: string): Date => {
      console.log('Parseando fecha:', dateStr);
      
      if (!dateStr || typeof dateStr !== 'string') {
        console.warn('Fecha vacía o inválida:', dateStr);
        return new Date();
      }
      

      const cleanDate = dateStr.trim();
      

      const ddMmYyyyMatch = cleanDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (ddMmYyyyMatch) {
        const [, day, month, year] = ddMmYyyyMatch;
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        console.log('Fecha parseada DD/MM/YYYY:', cleanDate, '->', date);
        return date;
      }
      

      const mmDdYyyyMatch = cleanDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (mmDdYyyyMatch) {
        const date = new Date(cleanDate);
        if (!isNaN(date.getTime())) {
          console.log('Fecha parseada MM/DD/YYYY:', cleanDate, '->', date);
          return date;
        }
      }
      

      const date = new Date(cleanDate);
      if (!isNaN(date.getTime())) {
        console.log('Fecha parseada directamente:', cleanDate, '->', date);
        return date;
      }
      
      console.warn('No se pudo parsear la fecha:', cleanDate);
      return new Date();
    };


    console.log('Historial de precios para', product.nombre, ':', product.priceHistory);


    const sortedHistory = [...product.priceHistory].sort((a, b) => 
      parseDate(a.fecha).getTime() - parseDate(b.fecha).getTime()
    );
    
    console.log('Historial ordenado:', sortedHistory);
    

    const dataPoints: PriceDataPoint[] = sortedHistory.map((item, index) => {
      const date = parseDate(item.fecha);
      

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      

      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                         'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const monthName = monthNames[date.getMonth()];
      
      const formattedFecha = `${day} ${monthName}`;
      
      console.log(`Punto ${index}: ${item.fecha} -> ${formattedFecha}`);
      
      return {
        price: parseFloat(item.price) || 0,
        fecha: item.fecha,
        formattedFecha: formattedFecha,
        supermarket: item.supermarket,
        color: supermarketColors[item.supermarket] || supermarketColors.default
      };
    });
    
    console.log('Data points finales:', dataPoints);
    

    return {
      labels: dataPoints.map(point => point.formattedFecha),
      datasets: [{
        data: dataPoints.map(point => point.price),
        color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
        strokeWidth: 3
      }],
      dataPoints: dataPoints
    };
  };


  const handleDataPointClick = (data: any) => {
    if (selectedProduct && data.index !== undefined) {
      const chartData = getChartData(selectedProduct);
      if (chartData.dataPoints && chartData.dataPoints[data.index]) {
        setSelectedDataPoint(chartData.dataPoints[data.index]);
      }
    }
  };


  const filteredProducts = consolidatedProducts.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = filterCategory === 'Todas' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });


  if (!isLoggedIn) {
    return <LoginRequired feature="lista de productos" />;
  }


  return (
    <View className="flex-1 bg-purple-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          <Logo/>

          {/* Header mejorado */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              🛍️ Mis Productos
            </Text>
            <Text className="text-gray-600">
              Gestiona y analiza tu historial de compras
            </Text>
          </View>

          {/* Buscador y filtros */}
          <View className="mb-6">
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
              <View className="flex-row items-center">
                <Ionicons name="search-outline" size={20} color="#9CA3AF" />
                <TextInput
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Buscar productos..."
                  className="flex-1 ml-3 text-base text-gray-900"
                />
              </View>
            </View>

            {/* Filtro de categorías */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-3 pb-2">
                {categorias.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-full ${
                      filterCategory === cat 
                        ? 'bg-purple-500' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${
                      filterCategory === cat 
                        ? 'text-white' 
                        : 'text-gray-600'
                    }`}>
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Stats */}
          <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600">{consolidatedProducts.length}</Text>
                <Text className="text-sm text-gray-600">Productos</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-600">
                  {new Set(products.map(p => p.supermarket)).size}
                </Text>
                <Text className="text-sm text-gray-600">Supermercados</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">
                  {new Set(products.map(p => p.category)).size}
                </Text>
                <Text className="text-sm text-gray-600">Categorías</Text>
              </View>
            </View>
          </View>

          {/* Lista de productos */}
          {filteredProducts.length === 0 ? (
            <View className="bg-white shadow-sm border border-gray-100 rounded-xl p-8 items-center">
              {searchText || filterCategory !== 'Todas' ? (
                <>
                  <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                    <Ionicons name="search-outline" size={40} color="#6B7280" />
                  </View>
                  <Text className="text-xl font-semibold text-gray-900 mb-2">
                    No se encontraron productos
                  </Text>
                  <Text className="text-gray-600 text-center mb-4">
                    Intenta con otros términos de búsqueda
                  </Text>
                  <Pressable
                    onPress={() => {
                      setSearchText('');
                      setFilterCategory('Todas');
                    }}
                    className="bg-purple-100 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-purple-600 font-medium">Limpiar filtros</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
                    <Ionicons name="bag-outline" size={40} color="#8B5CF6" />
                  </View>
                  <Text className="text-xl font-semibold text-gray-900 mb-2">
                    No hay productos guardados
                  </Text>
                  <Text className="text-gray-600 text-center">
                    Agrega productos desde la pantalla principal
                  </Text>
                </>
              )}
            </View>
          ) : (
            filteredProducts.map((product, index) => (
              <View key={index} className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 mb-4">
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800">{product.nombre}</Text>
                    <View className="flex-row items-center mt-1">
                      <View className="bg-purple-100 px-2 py-1 rounded-full">
                        <Text className="text-purple-700 text-xs font-medium">{product.category}</Text>
                      </View>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm text-gray-500 mb-1">Último precio</Text>
                    <View className="bg-green-50 px-3 py-1 rounded-full">
                      <Text className="text-green-700 font-bold text-lg">${product.lastPrice}</Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-500 text-sm ml-1">
                      {product.priceHistory.length} registro{product.priceHistory.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="storefront-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-500 text-sm ml-1">
                      {new Set(product.priceHistory.map(h => h.supermarket)).size} tienda{new Set(product.priceHistory.map(h => h.supermarket)).size !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>

                <View className="flex-row space-x-3">
                  <Pressable 
                    className="flex-1 bg-purple-50 border border-purple-200 rounded-lg p-3 active:bg-purple-100"
                    onPress={() => viewProductDetails(product)}
                  >
                    <Text className="text-center text-purple-600 font-medium">Ver detalles</Text>
                  </Pressable>
                  <Pressable 
                    className="bg-red-50 border border-red-200 rounded-lg p-3 active:bg-red-100"
                    onPress={() => deleteProduct(product.nombre)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal de detalles del producto mejorado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white rounded-xl p-6 w-11/12 max-h-[90%]">
            {selectedProduct && (
              <>
                <View className="flex-row justify-between items-center mb-6">
                  <View className="flex-1">
                    <Text className="font-bold text-2xl text-gray-800">
                      {selectedProduct.nombre}
                    </Text>
                    <View className="bg-purple-100 px-3 py-1 rounded-full mt-2 self-start">
                      <Text className="text-purple-700 font-medium text-sm">
                        {selectedProduct.category}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center space-x-2">
                    <Pressable 
                      onPress={() => deleteProduct(selectedProduct.nombre)}
                      className="bg-red-100 p-2 rounded-full"
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </Pressable>
                    <Pressable 
                      onPress={() => setModalVisible(false)}
                      className="bg-gray-100 p-2 rounded-full"
                    >
                      <Ionicons name="close" size={24} color="#6b7280" />
                    </Pressable>
                  </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {selectedProduct.priceHistory.length > 1 ? (
                    <View className="mb-6">
                      <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                        <Text className="font-semibold text-lg text-gray-800 mb-3">
                          📈 Evolución del precio
                        </Text>
                        <Text className="text-gray-500 text-sm mb-3">
                          Toca en cualquier punto para ver detalles
                        </Text>
                        
                        <LineChart
                          data={getChartData(selectedProduct)}
                          width={screenWidth - 60}
                          height={220}
                          chartConfig={{
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
                            strokeWidth: 2,
                            barPercentage: 0.5,
                            useShadowColorFromDataset: false,
                            decimalPlaces: 0,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            propsForDots: {
                              r: "6",
                              strokeWidth: "2",
                              stroke: "#FFFFFF"
                            }
                          }}
                          bezier
                          style={{
                            marginVertical: 8,
                            borderRadius: 16
                          }}
                          decorator={() => {
                            return selectedDataPoint ? (
                              <View
                                style={{
                                  backgroundColor: selectedDataPoint.color || "rgba(139, 92, 246, 0.8)",
                                  padding: 8,
                                  borderRadius: 8,
                                  position: "absolute",
                                  top: 0,
                                  right: 0
                                }}
                              >
                                <Text style={{ color: "white", fontWeight: "600" }}>
                                  ${selectedDataPoint.price}
                                </Text>
                              </View>
                            ) : null;
                          }}
                          onDataPointClick={handleDataPointClick}
                          fromZero
                        />
                        
                        {/* Información del punto seleccionado */}
                        {selectedDataPoint && (
                          <View className="bg-purple-50 p-4 rounded-lg mt-3">
                            <View className="flex-row justify-between items-center">
                              <Text className="font-semibold text-gray-800">
                                {selectedDataPoint.fecha}
                              </Text>
                              <Text className="font-bold text-purple-600 text-lg">
                                ${selectedDataPoint.price}
                              </Text>
                            </View>
                            <View className="flex-row items-center mt-2">
                              <Ionicons name="storefront-outline" size={16} color="#6B46C1" />
                              <Text className="text-gray-700 ml-2">
                                Comprado en {selectedDataPoint.supermarket}
                              </Text>
                            </View>
                          </View>
                        )}
                        
                        {/* Leyenda de supermercados */}
                        <View className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <Text className="text-gray-700 font-medium mb-2">🏪 Supermercados:</Text>
                          <View className="flex-row flex-wrap">
                            {Object.entries(supermarketColors)
                              .filter(([name]) => name !== 'default' && selectedProduct.priceHistory.some(item => item.supermarket === name))
                              .map(([name, color], index) => (
                                <View key={index} className="flex-row items-center mr-4 mb-2">
                                  <View 
                                    style={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: 5,
                                      backgroundColor: color,
                                      marginRight: 5
                                    }} 
                                  />
                                  <Text className="text-xs text-gray-700">{name}</Text>
                                </View>
                              ))
                            }
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View className="mb-4 p-5 bg-gray-50 rounded-xl">
                      <Text className="text-center text-gray-500">📊 No hay suficientes datos para mostrar el historial de precios</Text>
                    </View>
                  )}

                  {/* Historial de compras mejorado */}
                  <View className="mb-6">
                    <Text className="font-semibold text-lg text-gray-800 mb-4">🧾 Historial de compras</Text>
                    {selectedProduct.priceHistory.map((historyItem, idx) => (
                      <TouchableOpacity 
                        key={idx} 
                        className="mb-3 p-4 bg-white shadow-sm border border-gray-100 rounded-xl"
                        onPress={() => {
                          // Usar la misma función de parseo del gráfico
                          const parseDate = (dateStr: string): Date => {
                            if (!dateStr || typeof dateStr !== 'string') return new Date();
                            
                            const cleanDate = dateStr.trim();
                            const ddMmYyyyMatch = cleanDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
                            if (ddMmYyyyMatch) {
                              const [, day, month, year] = ddMmYyyyMatch;
                              return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            }
                            
                            const date = new Date(cleanDate);
                            return isNaN(date.getTime()) ? new Date() : date;
                          };

                          const date = parseDate(historyItem.fecha);
                          const day = date.getDate();
                          const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                                             'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                          const monthName = monthNames[date.getMonth()];
                          
                          setSelectedDataPoint({
                            price: parseFloat(historyItem.price) || 0,
                            fecha: historyItem.fecha,
                            formattedFecha: `${day} ${monthName}`,
                            supermarket: historyItem.supermarket,
                            color: supermarketColors[historyItem.supermarket] || supermarketColors.default
                          });
                        }}
                      >
                        <View className="flex-row justify-between mb-1 items-center">
                          <View className="flex-row items-center">
                            <View style={{
                              width: 10,
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: supermarketColors[historyItem.supermarket] || supermarketColors.default,
                              marginRight: 8
                            }} />
                            <Text className="text-gray-800 font-medium">{historyItem.fecha}</Text>
                          </View>
                          <Text className="font-bold text-purple-600 text-lg">${historyItem.price}</Text>
                        </View>
                        <View className="flex-row items-center mt-2">
                          <Ionicons name="storefront-outline" size={16} color="#6B46C1" />
                          <Text className="text-gray-600 ml-2">{historyItem.supermarket}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default productos;
