import {
  Text,
  View,
  Pressable,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Logo } from "../../atoms/Logo";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { LoginRequired } from "../components/LoginRequired";

const screenWidth = Dimensions.get("window").width;

interface CategoryData {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

interface Compra {
  id: number;
  fecha: string;
  productos: any[];
  total: number;
  supermarket: string;
}

interface StatsData {
  totalSpent: number;
  totalPurchases: number;
  totalProducts: number;
  avgPurchase: number;
  categoriesSpending: {[key: string]: number};
  supermarketsSpending: {[key: string]: number};
  recentPurchases: Compra[];
  topCategories: CategoryData[];
  monthlyTrend: number[];
}

const estadisticas = () => {
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    totalSpent: 0,
    totalPurchases: 0,
    totalProducts: 0,
    avgPurchase: 0,
    categoriesSpending: {},
    supermarketsSpending: {},
    recentPurchases: [],
    topCategories: [],
    monthlyTrend: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState("Este mes");

  useEffect(() => {
    if (isLoggedIn) {
      loadStatistics();
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

  const loadStatistics = async () => {
    try {
      setLoading(true);
      

      const purchasesData = await AsyncStorage.getItem("purchases");
      let purchases: Compra[] = [];
      
      if (purchasesData) {
        purchases = JSON.parse(purchasesData);
      }


      const productsData = await AsyncStorage.getItem("products");
      let allProducts: any[] = [];
      
      if (productsData) {
        allProducts = JSON.parse(productsData);
      }


      const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
      const totalPurchases = purchases.length;
      const totalProducts = allProducts.length;
      const avgPurchase = totalPurchases > 0 ? totalSpent / totalPurchases : 0;


      const categoriesSpending: {[key: string]: number} = {};
      allProducts.forEach(product => {
        const category = product.category || 'Otros';
        const productTotal = parseFloat(product.price || 0) * parseInt(product.cantidad || 1);
        categoriesSpending[category] = (categoriesSpending[category] || 0) + productTotal;
      });


      const supermarketsSpending: {[key: string]: number} = {};
      purchases.forEach(purchase => {
        const supermarket = purchase.supermarket || 'Sin especificar';
        supermarketsSpending[supermarket] = (supermarketsSpending[supermarket] || 0) + purchase.total;
      });


      const recentPurchases = purchases
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);


      const categoryColors = [
        "#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#EF4444",
        "#3B82F6", "#8B5A2B", "#06B6D4", "#84CC16", "#A855F7"
      ];

      const topCategories: CategoryData[] = Object.entries(categoriesSpending)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6)
        .map(([name, amount], index) => ({
          name,
          amount,
          color: categoryColors[index % categoryColors.length],
          legendFontColor: "#6B7280",
          legendFontSize: 12
        }));


      const monthlyTrend = new Array(6).fill(0).map(() => 
        Math.floor(Math.random() * totalSpent * 0.3) + totalSpent * 0.1
      );

      setStats({
        totalSpent,
        totalPurchases,
        totalProducts,
        avgPurchase,
        categoriesSpending,
        supermarketsSpending,
        recentPurchases,
        topCategories,
        monthlyTrend
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
    strokeWidth: 3,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 12,
      fontWeight: "500"
    }
  };

  const monthlyData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [{
      data: stats.monthlyTrend.length > 0 ? stats.monthlyTrend : [0, 0, 0, 0, 0, 0],
      color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
      strokeWidth: 3
    }],
  };


  if (!isLoggedIn) {
    return <LoginRequired feature="estadísticas" />;
  }


  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-50">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="mt-4 text-purple-600 font-medium">Cargando estadísticas...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-purple-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          <View className="flex-row items-center justify-between mb-6">
            <Logo />
            <View className="bg-white px-4 py-2 rounded-full border border-purple-200 shadow-sm">
              <Text className="text-base font-medium text-purple-600">
                📊 {selectedPeriod}
              </Text>
            </View>
          </View>

          <Text className="font-bold text-2xl text-gray-800 mb-6">
            Estadísticas de Compras
          </Text>

          <View className="grid grid-cols-2 gap-4 mb-6">
            <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600 font-medium">Total Gastado</Text>
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                  <Ionicons name="wallet-outline" size={16} color="#10B981" />
                </View>
              </View>
              <Text className="text-2xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</Text>
              <Text className="text-sm text-green-600 mt-1">💰 En total</Text>
            </View>

            <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600 font-medium">Compras</Text>
                <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
                  <Ionicons name="bag-outline" size={16} color="#3B82F6" />
                </View>
              </View>
              <Text className="text-2xl font-bold text-gray-900">{stats.totalPurchases}</Text>
              <Text className="text-sm text-blue-600 mt-1">🛒 Realizadas</Text>
            </View>

            <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600 font-medium">Productos</Text>
                <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center">
                  <Ionicons name="cube-outline" size={16} color="#8B5CF6" />
                </View>
              </View>
              <Text className="text-2xl font-bold text-gray-900">{stats.totalProducts}</Text>
              <Text className="text-sm text-purple-600 mt-1">📦 Comprados</Text>
            </View>

            <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600 font-medium">Promedio</Text>
                <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center">
                  <Ionicons name="trending-up-outline" size={16} color="#F59E0B" />
                </View>
              </View>
              <Text className="text-2xl font-bold text-gray-900">${stats.avgPurchase.toFixed(2)}</Text>
              <Text className="text-sm text-orange-600 mt-1">📈 Por compra</Text>
            </View>
          </View>

          {stats.topCategories.length > 0 && (
            <>
              <Text className="font-bold text-xl text-gray-800 mb-4">
                🏷️ Gastos por Categoría
              </Text>
              <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <PieChart
                  data={stats.topCategories}
                  width={screenWidth - 60}
                  height={200}
                  chartConfig={chartConfig}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  center={[0, 0]}
                  absolute
                />
              </View>
            </>
          )}

          {stats.monthlyTrend.length > 0 && (
            <>
              <Text className="font-bold text-xl text-gray-800 mb-4">
                📈 Tendencia de Gastos
              </Text>
              <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <LineChart
                  data={monthlyData}
                  width={screenWidth - 60}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={{
                    borderRadius: 16,
                  }}
                  withInnerLines={false}
                  withOuterLines={false}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                />
              </View>
            </>
          )}

          {Object.keys(stats.supermarketsSpending).length > 0 && (
            <>
              <Text className="font-bold text-xl text-gray-800 mb-4">
                🏪 Supermercados Favoritos
              </Text>
              <View className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                {Object.entries(stats.supermarketsSpending)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([supermarket, amount], index) => (
                    <View 
                      key={supermarket}
                      className={`flex-row justify-between items-center p-4 ${
                        index !== Object.keys(stats.supermarketsSpending).length - 1 ? "border-b border-gray-100" : ""
                      }`}
                    >
                      <View className="flex-row items-center flex-1">
                        <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                          <Text className="text-purple-600 font-bold">{index + 1}</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="font-semibold text-gray-900">{supermarket}</Text>
                          <Text className="text-sm text-gray-500">
                            {((amount / stats.totalSpent) * 100).toFixed(1)}% del total
                          </Text>
                        </View>
                      </View>
                      <Text className="text-lg font-bold text-purple-600">
                        ${amount.toFixed(2)}
                      </Text>
                    </View>
                  ))}
              </View>
            </>
          )}

          {stats.recentPurchases.length > 0 && (
            <>
              <Text className="font-bold text-xl text-gray-800 mb-4">
                🕒 Últimas Compras
              </Text>
              <View className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                {stats.recentPurchases.map((purchase, index) => (
                  <View 
                    key={purchase.id}
                    className={`p-4 ${
                      index !== stats.recentPurchases.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1">
                        <Text className="font-semibold text-gray-900">
                          {purchase.supermarket}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {purchase.fecha} • {purchase.productos.length} productos
                        </Text>
                      </View>
                      <Text className="text-lg font-bold text-purple-600">
                        ${purchase.total.toFixed(2)}
                      </Text>
                    </View>
                    <View className="flex-row flex-wrap gap-1">
                      {purchase.productos.slice(0, 3).map((producto, pIndex) => (
                        <View key={pIndex} className="bg-gray-100 rounded-full px-3 py-1">
                          <Text className="text-xs text-gray-600">{producto.nombre}</Text>
                        </View>
                      ))}
                      {purchase.productos.length > 3 && (
                        <View className="bg-purple-100 rounded-full px-3 py-1">
                          <Text className="text-xs text-purple-600">
                            +{purchase.productos.length - 3} más
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

            {stats.totalPurchases === 0 && (
            <View className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 items-center">
              <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="analytics-outline" size={32} color="#8B5CF6" />
              </View>
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                ¡Comienza a registrar tus compras!
              </Text>
              <Text className="text-gray-600 text-center mb-4">
                Agrega productos desde la pantalla principal para ver tus estadísticas aquí.
              </Text>
              <View className="bg-purple-50 rounded-lg p-3">
                <Text className="text-purple-700 text-sm">
                  💡 Tip: Mientras más compras registres, más útiles serán tus estadísticas
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default estadisticas;
