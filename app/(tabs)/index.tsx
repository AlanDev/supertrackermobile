import {
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Alert,
  DrawerLayoutAndroid,
  ActivityIndicator,
  Linking,
  Image,
  Modal,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../components/Logo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import ComerciosModal from "../components/ComerciosModal";

interface Producto {
  productName: string;
  price: string;
  quantity: string;
  supermarket: string;
  category: string;
  index?: number;
}

interface ListaProducto {
  nombre: string;
  cantidad: string;
  price: string;
  supermarket: string;
  category: string;
  formattedDate: string;
}

interface Compra {
  id: number;
  fecha: string;
  productos: ListaProducto[];
  total: number;
  supermarket: string;
}

const negocios = [
  {
    id: 1,
    nombre: "Supermercado Express",
    categoria: "Supermercado",
    direccion: "Avenida 9 de julio 10",
    distancia: "0.5 km",
    horario: "8:00 - 22:00",
    rating: 4.5,
    imagenUrl:
      "https://img.freepik.com/free-photo/shopping-cart-supermarket_23-2148879372.jpg?size=626&ext=jpg",
  },
  {
    id: 2,
    nombre: "Farmacia Salud",
    categoria: "Farmacia",
    direccion: "Calle Central 456",
    distancia: "0.8 km",
    horario: "24 horas",
    rating: 4.2,
    imagenUrl:
      "https://img.freepik.com/free-photo/pharmacist-with-tablet-standing-pharmacy-counter_107420-83608.jpg?size=626&ext=jpg",
  },
  {
    id: 3,
    nombre: "Tienda Electrónica",
    categoria: "Electrónica",
    direccion: "Plaza Comercial 789",
    distancia: "1.2 km",
    horario: "9:00 - 20:00",
    rating: 4.0,
    imagenUrl:
      "https://img.freepik.com/free-photo/electronic-devices-balancing-concept_23-2150422322.jpg?size=626&ext=jpg",
  },
  {
    id: 4,
    nombre: "Cafetería Aroma",
    categoria: "Cafetería",
    direccion: "Av. del Parque 234",
    distancia: "0.3 km",
    horario: "7:00 - 21:00",
    rating: 4.8,
    imagenUrl:
      "https://img.freepik.com/free-photo/people-cafe-drinking-coffee_23-2149004692.jpg?size=626&ext=jpg",
  },
];

export default function Index() {
  // Todos los hooks agrupados al inicio del componente
  const drawer = useRef<DrawerLayoutAndroid>(null);
  const [drawerPosition, setDrawerPosition] = useState<"left" | "right">(
    "right"
  );
  const [escaneado, setEscaneado] = useState<boolean>(false);
  const [codigo, setCodigo] = useState<string | null>(null);
  const [producto, setProducto] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [productName, setProductName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [supermarket, setSupermarket] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [purchaseDate, setPurchaseDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [enviarLista, setEnviarLista] = useState<ListaProducto[]>([]);
  const [showSupermarkets, setShowSupermarkets] = useState<boolean>(false);
  const [showMercados, setShowMercados] = useState(false);

  const handleAddList = async () => {
    try {
      // Guardar productos
      const existingProducts = await AsyncStorage.getItem("products");
      let products = [];

      if (existingProducts) {
        products = JSON.parse(existingProducts);
      }

      const newProducts = [...products, ...enviarLista];
      await AsyncStorage.setItem("products", JSON.stringify(newProducts));

      // Guardar historial de compra
      const existingHistory = await AsyncStorage.getItem("purchases");
      let history = [];

      if (existingHistory) {
        history = JSON.parse(existingHistory);
      }

      // Calcular total de la compra
      const total = enviarLista.reduce(
        (sum, item) => sum + parseFloat(item.price) * parseInt(item.cantidad),
        0
      );

      const newPurchase: Compra = {
        id: Date.now(),
        fecha: formattedDate,
        productos: enviarLista,
        total: total,
        supermarket: enviarLista[0]?.supermarket || "Desconocido",
      };

      const updatedHistory = [...history, newPurchase];
      await AsyncStorage.setItem("purchases", JSON.stringify(updatedHistory));

      // Limpiar la lista después de guardar
      setEnviarLista([]);
      console.log("Compra guardada:", {
        productosNuevos: enviarLista,
        totalCompra: total,
        historial: updatedHistory,
      });
      Alert.alert("Éxito", "Compra guardada correctamente");
    } catch (error) {
      console.error("Error al guardar compra:", error);
      Alert.alert("Error", "No se pudo guardar la compra");
    }
  };

  // Efecto para mostrar la pantalla de carga
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  // Efecto para formatear la fecha
  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setFormattedDate(purchaseDate.toLocaleDateString("es-ES", options));
  }, [purchaseDate]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center items-center bg-purple-50">
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      </SafeAreaView>
    );
  }

  const navigationView = () => (
    <SafeAreaView className="p-5 flex-1 bg-white">
      <Text className="text-2xl font-bold text-purple-600 mb-5">
        Mis Productos
      </Text>
      {producto.length === 0 ? (
        <View className="items-center justify-center p-6 bg-purple-50 rounded-xl">
          <Text className="text-gray-500 text-center">
            No hay productos en la lista todavía
          </Text>
          <Text className="text-purple-500 mt-2 text-center">
            Agrega tu primer producto desde la pantalla principal
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1">
          {producto.map((item, index) => (
            <View
              key={index}
              className="p-4 mb-3 border border-gray-100 shadow-sm rounded-xl bg-white"
            >
              <Text className="font-bold text-gray-800 text-lg">
                {item.productName}
              </Text>
              <View className="flex-row justify-between mt-2">
                <View className="bg-purple-50 px-3 py-1 rounded-full">
                  <Text className="text-purple-700 font-medium">
                    Cant: {item.quantity}
                  </Text>
                </View>
                <View className="bg-green-50 px-3 py-1 rounded-full">
                  <Text className="text-green-700 font-medium">
                    ${item.price}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-500 mt-2">{item.supermarket}</Text>
              <View className="mt-1">
                <Text className="text-gray-400 text-xs">{item.category}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <Pressable
        onPress={() => drawer.current?.closeDrawer()}
        className="p-4 bg-purple-600 rounded-xl mt-4 shadow-sm"
      >
        <Text className="text-white text-center font-bold">Cerrar</Text>
      </Pressable>
    </SafeAreaView>
  );

  const categorias = [
    { id: 1, name: "Lácteos" },
    { id: 2, name: "Carnes" },
    { id: 3, name: "Frutas/Verduras" },
    { id: 5, name: "Bebidas" },
    { id: 6, name: "Limpieza" },
    { id: 7, name: "Higiene Personal" },
    { id: 8, name: "Otros" },
  ];

  const handleAddProduct = () => {
    if (!productName || !price || !quantity || !supermarket || !category) {
      Alert.alert("Por favor completa todos los campos");
      return;
    }
    const newProducto: Producto = {
      productName,
      price,
      quantity,
      supermarket,
      category,
    };
    setProducto([...producto, newProducto]);

    // Agregar también a enviarLista
    const newLista = {
      nombre: productName,
      cantidad: quantity,
      price: price,
      supermarket: supermarket,
      category: category,
      formattedDate: formattedDate,
    };
    setEnviarLista([...enviarLista, newLista]);

    console.log("Producto agregado");
    console.log("Nombre del producto: ", productName);
    console.log("Precio: ", price);
    console.log("Cantidad: ", quantity);
    console.log("Supermercado: ", supermarket);
    console.log("Categoría: ", category);

    setProductName("");
    setPrice("");
    setQuantity("");
    setSupermarket("");
    setCategory("");
    Keyboard.dismiss();
  };

  const onDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPurchaseDate(selectedDate);
    }
  };

  const abrirEnMaps = (direccion: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      direccion
    )}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView className="flex-1 bg-purple-50">
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300}
        drawerPosition={drawerPosition}
        renderNavigationView={navigationView}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView className="flex-1">
            <View className="flex-1 px-6 py-8 min-h-screen">
              <View className="flex-row items-center justify-between mb-6">
                <Logo />
                <View className="flex-row items-center gap-3">
                  <Pressable
                    onPress={() => drawer.current?.openDrawer()}
                    className="bg-white p-3 rounded-full shadow-sm"
                  >
                    <Text className="text-purple-600 font-bold">
                      {producto.length} 📋
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setShowMercados(true)}
                    className="bg-white p-3 rounded-full shadow-sm"
                  >
                    <Ionicons
                      name="storefront-outline"
                      size={24}
                      color="#8b5cf6"
                    />
                  </Pressable>
                </View>
              </View>

              <View className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 mb-6">
                <Text className="font-bold text-xl text-gray-800 mb-4">
                  Agregar producto
                </Text>

                <Text className="text-gray-600 font-medium mb-1">
                  Nombre del producto
                </Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3"
                  placeholder="¿Qué producto compraste?"
                  placeholderTextColor="#9ca3af"
                  value={productName}
                  onChangeText={setProductName}
                />

                <View className="flex-row gap-3 mb-3">
                  <View className="flex-1">
                    <Text className="text-gray-600 font-medium mb-1">
                      Precio
                    </Text>
                    <TextInput
                      className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                      placeholder="$0.00"
                      placeholderTextColor="#9ca3af"
                      value={price}
                      onChangeText={setPrice}
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-600 font-medium mb-1">
                      Cantidad
                    </Text>
                    <TextInput
                      className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                      placeholder="0"
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                      value={quantity}
                      onChangeText={setQuantity}
                    />
                  </View>
                </View>

                <Text className="text-gray-600 font-medium mb-1">
                  Categoría
                </Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-5"
                  placeholder="Ej: Lácteos, Carnes, etc."
                  placeholderTextColor="#9ca3af"
                  value={category}
                  onChangeText={setCategory}
                />
                <Text className="text-gray-600 font-medium mb-1">
                  Supermercado
                </Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-5"
                  placeholder="Supermercado"
                  placeholderTextColor="#9ca3af"
                  value={supermarket}
                  onChangeText={setSupermarket}
                />

                <Pressable
                  className="bg-purple-600 rounded-xl p-4 shadow-sm"
                  onPress={handleAddProduct}
                >
                  <Text className="text-white text-center font-bold">
                    Agregar producto
                  </Text>
                </Pressable>
              </View>

              <View className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 mb-6">
                <Text className="font-bold text-xl text-gray-800 mb-3">
                  Fecha de compra
                </Text>
                <Pressable
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex-row justify-between items-center"
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text className="text-gray-700 font-medium">
                    {formattedDate || "Seleccionar fecha"}
                  </Text>
                  <Text className="text-purple-600">📅</Text>
                </Pressable>

                {showDatePicker && (
                  <DateTimePicker
                    value={purchaseDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                  />
                )}
              </View>

              <Pressable
                className="bg-purple-600 rounded-xl p-4 shadow-sm mb-8"
                onPress={handleAddList}
              >
                <Text className="text-white text-center font-bold">
                  Guardar compra
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </DrawerLayoutAndroid>

      {/* Comercios Modal */}
      <ComerciosModal
        visible={showMercados}
        onClose={() => setShowMercados(false)}
      />

      {/* Existing supermarkets modal */}
      {showSupermarkets && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white rounded-xl p-6 w-11/12 max-h-3/4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bold text-xl text-gray-800">
                Supermercados
              </Text>
              <Pressable onPress={() => setShowSupermarkets(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <ScrollView>
              <View className="space-y-3">
                <Pressable
                  className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg"
                  onPress={() => {
                    setSupermarket("Carrefour");
                    setShowSupermarkets(false);
                  }}
                >
                  <Text className="text-gray-700">Carrefour</Text>
                  <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </Pressable>
                <Pressable
                  className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg"
                  onPress={() => {
                    setSupermarket("Dia");
                    setShowSupermarkets(false);
                  }}
                >
                  <Text className="text-gray-700">Dia</Text>
                  <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </Pressable>
                <Pressable
                  className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg"
                  onPress={() => {
                    setSupermarket("Coto");
                    setShowSupermarkets(false);
                  }}
                >
                  <Text className="text-gray-700">Coto</Text>
                  <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </Pressable>
                <Pressable
                  className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg"
                  onPress={() => {
                    setSupermarket("Jumbo");
                    setShowSupermarkets(false);
                  }}
                >
                  <Text className="text-gray-700">Jumbo</Text>
                  <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
