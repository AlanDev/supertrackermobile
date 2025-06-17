import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Dimensions,
  AppState,
  AppStateStatus,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Svg, Circle, Rect, Path } from "react-native-svg";
import Logo from "../components/Logo";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import LoginRequired from "../components/LoginRequired";

const screenWidth = Dimensions.get("window").width;

interface CategoryData {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

interface ProductData {
  name: string;
  cantidad: number;
  gasto: number;
  category: string;
}

const estadisticas = () => {
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState({
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0],
      },
    ],
  });
  const [topProducts, setTopProducts] = useState<ProductData[]>([]);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (isLoggedIn) {
      loadStatistics();

      const subscription = AppState.addEventListener("change", handleAppStateChange);
      
      return () => {
        subscription.remove();
      };
    }
  }, [isLoggedIn]);
  
  useFocusEffect(
    React.useCallback(() => {
      if (isLoggedIn) {
        loadStatistics();
      }
      return () => {};
    }, [isLoggedIn])
  );

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      loadStatistics();
    }
    appState.current = nextAppState;
  };

  const loadStatistics = async () => {
    try {
      // Intentar cargar productos del home desde AsyncStorage
      const homeProducts = await AsyncStorage.getItem('homeProducts');
      let parsedProducts: ProductData[] = [];
      let totalGasto = 0;
      let categories: {[key: string]: number} = {};

      if (homeProducts) {
        parsedProducts = JSON.parse(homeProducts);
        
        // Cargar las categorías predefinidas del home
        const lastCategories = await AsyncStorage.getItem('categories');
        let predefinedCategories: string[] = [];
        
        if (lastCategories) {
          predefinedCategories = JSON.parse(lastCategories);
        }
        
        // Inicializar las categorías con 0
        predefinedCategories.forEach(cat => {
          categories[cat] = 0;
        });
        
        // Calcular gastos totales y por categoría
        parsedProducts.forEach(product => {
          totalGasto += product.gasto;
          
          // Asignar a la categoría correspondiente
          if (predefinedCategories.includes(product.category)) {
            categories[product.category] = (categories[product.category] || 0) + product.gasto;
          } else {
            // Si no coincide con ninguna categoría predefinida, usar la primera letra del nombre como guía
            const productName = product.name.toLowerCase();
            
            if (productName.includes('leche') || productName.includes('queso') || productName.includes('yogur')) {
              categories['Lácteos'] = (categories['Lácteos'] || 0) + product.gasto;
            } else if (productName.includes('carne') || productName.includes('pollo') || productName.includes('cerdo')) {
              categories['Carnes'] = (categories['Carnes'] || 0) + product.gasto;
            } else if (productName.includes('verdura') || productName.includes('fruta') || productName.includes('manzana')) {
              categories['Frutas y Verduras'] = (categories['Frutas y Verduras'] || 0) + product.gasto;
            } else if (productName.includes('limpieza') || productName.includes('detergente') || productName.includes('jabon')) {
              categories['Limpieza'] = (categories['Limpieza'] || 0) + product.gasto;
            } else {
              categories['Varios'] = (categories['Varios'] || 0) + product.gasto;
            }
          }
        });

        // Ordenar productos por gasto
        parsedProducts.sort((a, b) => b.gasto - a.gasto);
        setTopProducts(parsedProducts.slice(0, 5)); // Top 5 productos
      } 
      
      // Si no hay productos guardados, usar datos de ejemplo
      if (!homeProducts || parsedProducts.length === 0) {
        totalGasto = 15240;
        
        // Datos de ejemplo para categorías
        categories = {
          'Lácteos': 2560,
          'Carnes': 4200,
          'Frutas y Verduras': 1850,
          'Limpieza': 3200,
          'Varios': 3430
        };
        
        // Datos de ejemplo para productos
        
      }
      
      // Establecer gasto mensual
      setMonthlySpending(totalGasto);
      
      // Convertir datos de categorías al formato necesario para el gráfico
      const categoryColors = {
        'Lácteos': "#FF6384",
        'Carnes': "#36A2EB",
        'Frutas y Verduras': "#FFCE56",
        'Limpieza': "#4BC0C0",
        'Higiene Personal': "#9966FF",
        'Bebidas': "#FF9F40",
        'Panadería': "#4BC0C0",
        'Congelados': "#36A2EB",
        'Almacén': "#FF6384",
        'Varios': "#C9CBCF"
      };
      
      const categoryData: CategoryData[] = Object.keys(categories).map(key => ({
        name: key,
        amount: categories[key],
        color: categoryColors[key as keyof typeof categoryColors] || "#000000",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12
      }));
      
      setCategoriesData(categoryData);
      
      // Datos de gasto mensual (simulados)
      setMonthlyData({
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        datasets: [
          {
            data: [totalGasto],
          },
        ],
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading statistics:', error);
      setLoading(false);
    }
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  // Si el usuario no está autenticado, mostrar el componente LoginRequired
  if (!isLoggedIn) {
    return <LoginRequired feature="estadísticas" />;
  }

  // Si está autenticado, mostrar el contenido normal
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-50">
        <Text>Cargando estadísticas...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-purple-50">
      <ScrollView>
        <View className="px-6 py-8">
          <Logo />

          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-semibold text-2xl text-gray-800">
              Estadísticas
            </Text>

            <Pressable className="bg-white px-4 py-2 rounded-full border border-purple-200 shadow-sm">
              <Text className="text-base font-medium text-purple-600">
                Este mes
              </Text>
            </Pressable>
          </View>

          {/* Total mensual */}
          <View className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <Text className="text-gray-500 font-medium mb-2">Gasto total del mes</Text>
            <Text className="text-3xl font-bold text-gray-800">${monthlySpending}</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="trending-up" size={18} color="#10B981" />
              <Text className="text-green-500 font-medium ml-1">+3% vs mes anterior</Text>
            </View>
          </View>

          {/* Gastos por categoría */}
          <Text className="font-semibold text-xl text-gray-800 mb-3">
            Gastos por Categoría
          </Text>
          <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <PieChart
              data={categoriesData}
              width={screenWidth - 60}
              height={180}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="10"
              absolute
            />
          </View>

          {/* Gastos mensuales */}
          <Text className="font-semibold text-xl text-gray-800 mb-3">
            Gastos Mensuales
          </Text>
          <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <LineChart
              data={monthlyData}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                borderRadius: 16,
              }}
            />
          </View>

          {/* Productos más comprados */}
          <Text className="font-semibold text-xl text-gray-800 mb-3">
            Productos Más Comprados
          </Text>
          <View className="bg-white rounded-xl shadow-sm mb-6">
            {topProducts.map((product, index) => (
              <View 
                key={index} 
                className={`flex-row justify-between items-center p-4 ${
                  index !== topProducts.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <View className="flex-row items-center">
                  <View className="h-8 w-8 rounded-full bg-purple-100 justify-center items-center mr-3">
                    <Text className="font-bold text-purple-600">{index + 1}</Text>
                  </View>
                  <Text className="font-medium text-gray-800">{product.name}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-gray-500 mr-3">x{product.cantidad}</Text>
                  <Text className="text-purple-600 font-medium">${product.gasto}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default estadisticas;

const styles = StyleSheet.create({});
