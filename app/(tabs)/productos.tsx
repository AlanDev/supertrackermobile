import { Text, View, TextInput, Pressable, ScrollView, Modal, Dimensions, AppState, AppStateStatus, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Logo from "../components/Logo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import LoginRequired from "../components/LoginRequired";

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

// Colores para los diferentes supermercados (para las leyendas)
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
  const appState = useRef(AppState.currentState);
  
  // Estado para mostrar información del punto seleccionado en el gráfico
  const [selectedDataPoint, setSelectedDataPoint] = useState<PriceDataPoint | null>(null);

  // Cargar productos solo si el usuario está autenticado
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
        const loadedProducts: Product[] = JSON.parse(savedProducts);
        setProducts(loadedProducts);
        
        const productMap = new Map<string, ConsolidatedProduct>();
        
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
              return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
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

  const viewProductDetails = (product: ConsolidatedProduct) => {
    setSelectedProduct(product);
    setSelectedDataPoint(null); // Resetear punto seleccionado
    setModalVisible(true);
  };

  const getChartData = (product: ConsolidatedProduct) => {
    // Ordenar por fecha (más antiguas primero)
    const sortedHistory = [...product.priceHistory].sort((a, b) => 
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
    
    // Extraer datos para el gráfico
    const dataPoints: PriceDataPoint[] = sortedHistory.map(item => {
      const date = new Date(item.fecha);
      const day = date.getDate();
      const month = date.toLocaleString('es-ES', { month: 'short' });
      
      return {
        price: parseFloat(item.price),
        fecha: item.fecha,
        formattedFecha: `${day} ${month.substring(0, 3)}`,
        supermarket: item.supermarket,
        color: supermarketColors[item.supermarket] || supermarketColors.default
      };
    });
    
    // Datos para el gráfico
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

  // Manejar el clic en un punto del gráfico
  const handleDataPointClick = (data: any) => {
    if (selectedProduct && data.index !== undefined) {
      const chartData = getChartData(selectedProduct);
      if (chartData.dataPoints && chartData.dataPoints[data.index]) {
        setSelectedDataPoint(chartData.dataPoints[data.index]);
      }
    }
  };

  // Si el usuario no está autenticado, mostrar el componente LoginRequired
  if (!isLoggedIn) {
    return <LoginRequired feature="lista de productos" />;
  }

  // Si está autenticado, mostrar el contenido normal
  return (
    <ScrollView className="bg-purple-50 flex-1">
      <View className="flex-1 px-6 py-8">
        <Logo/>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="font-semibold text-2xl text-gray-800">Productos</Text>
          <View className="flex flex-row items-center">
            <Text className="text-base font-medium text-purple-600">Filtrar</Text>
          </View>
        </View>

        {consolidatedProducts.length === 0 ? (
          <View className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 mb-4">
            <Text className="text-center text-gray-500">No hay productos guardados</Text>
          </View>
        ) : (
          consolidatedProducts.map((product, index) => (
            <View key={index} className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 mb-4">
              <Text className="text-lg font-bold text-gray-800">{product.nombre}</Text>
              <View className="mt-2 flex-row justify-between items-center">
                <Text className="text-gray-600">Último precio: </Text>
                <View className="bg-green-50 px-3 py-1 rounded-full">
                  <Text className="text-green-700 font-medium">${product.lastPrice}</Text>
                </View>
              </View>
              <View className="mt-2 mb-3 pb-2 border-b border-gray-100">
                <Text className="text-gray-500">Categoría: <Text className="text-purple-600">{product.category}</Text></Text>
              </View>
              <Pressable 
                className="rounded-lg mt-2 border p-3 border-purple-500 active:bg-purple-50"
                onPress={() => viewProductDetails(product)}
              >
                <Text className="text-center text-purple-600 font-medium">Ver detalles</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>

      {/* Modal de detalles del producto mejorado visualmente */}
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
                  <View>
                    <Text className="font-bold text-2xl text-gray-800">
                      {selectedProduct.nombre}
                    </Text>
                    <Text className="text-purple-600 font-medium mt-1">
                      {selectedProduct.category}
                    </Text>
                  </View>
                  <Pressable 
                    onPress={() => setModalVisible(false)}
                    className="bg-gray-100 p-2 rounded-full"
                  >
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </Pressable>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {selectedProduct.priceHistory.length > 1 ? (
                    <View className="mb-6">
                      <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                        <Text className="font-semibold text-lg text-gray-800 mb-3">
                          Evolución del precio
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
                          <Text className="text-gray-700 font-medium mb-2">Supermercados:</Text>
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
                      <Text className="text-center text-gray-500">No hay suficientes datos para mostrar el historial de precios</Text>
                    </View>
                  )}

                  {/* Historial de compras mejorado visualmente */}
                  <View className="mb-6">
                    <Text className="font-semibold text-lg text-gray-800 mb-4">Historial de compras</Text>
                    {selectedProduct.priceHistory.map((historyItem, idx) => (
                      <TouchableOpacity 
                        key={idx} 
                        className="mb-3 p-4 bg-white shadow-sm border border-gray-100 rounded-xl"
                        onPress={() => {
                          // Crear un punto de datos para mostrar al hacer clic en el historial
                          const date = new Date(historyItem.fecha);
                          const day = date.getDate();
                          const month = date.toLocaleString('es-ES', { month: 'short' });
                          
                          setSelectedDataPoint({
                            price: parseFloat(historyItem.price),
                            fecha: historyItem.fecha,
                            formattedFecha: `${day} ${month.substring(0, 3)}`,
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
    </ScrollView>
  );
};

export default productos;
