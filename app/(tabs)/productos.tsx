import { Text, View, TextInput, Pressable, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import Logo from "../components/Logo";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  nombre: string;
  cantidad: string;
  price: string;
  supermarket: string;
  category: string;
  formattedDate: string;
}

const productos = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const savedProducts = await AsyncStorage.getItem('products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

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

        {products.length === 0 ? (
          <View className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 mb-4">
            <Text className="text-center text-gray-500">No hay productos guardados</Text>
          </View>
        ) : (
          products.map((product, index) => (
            <View key={index} className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 mb-4">
              <Text className="text-lg font-bold text-gray-800">{product.nombre}</Text>
              <View className="mt-2 flex-row justify-between items-center">
                <Text className="text-gray-600">Ultimo precio: </Text>
                <View className="bg-green-50 px-3 py-1 rounded-full">
                  <Text className="text-green-700 font-medium">${product.price}</Text>
                </View>
              </View>
              <View className="mt-2 mb-3 pb-2 border-b border-gray-100">
                <Text className="text-gray-500">Categoría: <Text className="text-purple-600">{product.category}</Text></Text>
              </View>
              <Pressable className="rounded-lg mt-2 border p-3 border-purple-500 active:bg-purple-50">
                <Text className="text-center text-purple-600 font-medium">Ver detalles</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default productos;
