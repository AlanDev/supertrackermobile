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
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../../atoms/Logo";
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
  id?: string;
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
  const [showDrawer, setShowDrawer] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const supermercadosPredefinidos = [
    { id: 1, nombre: "Carrefour" },
    { id: 2, nombre: "Dia" },
    { id: 3, nombre: "Coto" },
    { id: 4, nombre: "Jumbo" },
    { id: 5, nombre: "Chango Más" },
    { id: 6, nombre: "Vea" },
    { id: 7, nombre: "Disco" },
    { id: 8, nombre: "Walmart" }
  ];
  
  const categoriasPredefinidas = [
    { id: 1, nombre: "Lácteos" },
    { id: 2, nombre: "Carnes" },
    { id: 3, nombre: "Frutas y Verduras" },
    { id: 4, nombre: "Bebidas" },
    { id: 5, nombre: "Limpieza" },
    { id: 6, nombre: "Higiene Personal" },
    { id: 7, nombre: "Panadería" },
    { id: 8, nombre: "Congelados" },
    { id: 9, nombre: "Almacén" },
    { id: 10, nombre: "Otros" }
  ];
  
  const isAndroid = Platform.OS === 'android';

  const [totalProductos, setTotalProductos] = useState(0);
  
  useEffect(() => {
    const loadLastSupermarket = async () => {
      try {
        const lastSupermarket = await AsyncStorage.getItem('lastSupermarket');
        if (lastSupermarket) {
          setSupermarket(lastSupermarket);
        }
      } catch (error) {
        console.error('Error loading last supermarket:', error);
      }
    };
    
    loadLastSupermarket();
  }, []);
  
  useEffect(() => {
    const total = producto.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity));
    }, 0);
    
    setTotalProductos(total);
  }, [producto]);
  useEffect(() => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formatted = `${day}/${month}/${year}`;
    setFormattedDate(formatted);
  }, []);

  const handleAddList = async () => {
    try {
      if (enviarLista.length === 0) {
        Alert.alert("Error", "No hay productos en la lista");
        return;
      }

      const existingProducts = await AsyncStorage.getItem("products");
      let products = [];

      if (existingProducts) {
        products = JSON.parse(existingProducts);
      }

      const newProducts = [...products, ...enviarLista];
      await AsyncStorage.setItem("products", JSON.stringify(newProducts));
      const existingPurchases = await AsyncStorage.getItem("purchases");
      let purchases = [];

      if (existingPurchases) {
        purchases = JSON.parse(existingPurchases);
      }

      const newPurchase: Compra = {
        id: Date.now(),
        fecha: formattedDate,
        productos: enviarLista,
        total: totalProductos,
        supermarket: supermarket || 'Sin especificar'
      };

      purchases.push(newPurchase);
      await AsyncStorage.setItem("purchases", JSON.stringify(purchases));

      Alert.alert("¡Éxito!", "Compra guardada correctamente");
      
      setProducto([]);
      setEnviarLista([]);
      setProductName("");
      setPrice("");
      setQuantity("");
      setCategory("");
      
    } catch (error) {
      console.error("Error saving purchase:", error);
      Alert.alert("Error", "No se pudo guardar la compra");
    }
  };

  const deleteProduct = (index: number) => {
    Alert.alert(
      "Eliminar Producto",
      "¿Estás seguro de que deseas eliminar este producto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const newProductos = producto.filter((_, i) => i !== index);
            const newEnviarLista = enviarLista.filter((_, i) => i !== index);
            setProducto(newProductos);
            setEnviarLista(newEnviarLista);
          }
        }
      ]
    );
  };

  const editProduct = (index: number) => {
    const productToEdit = producto[index];
    setEditingProductIndex(index);
    setIsEditMode(true);
    setProductName(productToEdit.productName);
    setPrice(productToEdit.price);
    setQuantity(productToEdit.quantity);
    setSupermarket(productToEdit.supermarket);
    setCategory(productToEdit.category);
    
    if (isAndroid) {
      drawer.current?.closeDrawer();
    } else {
      setShowDrawer(false);
    }
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditingProductIndex(null);
    setProductName("");
    setPrice("");
    setQuantity("");
    setCategory("");
  };

  const navigationView = () => (
    <SafeAreaView className="flex-1 p-6 bg-purple-50">
      <Text className="text-2xl font-bold text-gray-800 mb-6">
        🛒 Lista actual ({producto.length})
      </Text>
      
      {producto.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="bag-outline" size={32} color="#8B5CF6" />
          </View>
          <Text className="text-gray-500 text-center">
            No hay productos agregados
          </Text>
        </View>
      ) : (
        <>
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
            <Text className="text-purple-600 font-semibold">Total estimado:</Text>
            <Text className="text-2xl font-bold text-gray-900">${totalProductos.toFixed(2)}</Text>
          </View>
          
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {producto.map((item, index) => (
              <View key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">{item.productName}</Text>
                    <Text className="text-gray-500 text-sm">{item.category}</Text>
                    <Text className="text-purple-600 text-sm">{item.supermarket}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-lg text-gray-900">
                      ${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      ${item.price} x {item.quantity}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <View className="flex-row space-x-3">
                    <Pressable
                      onPress={() => editProduct(index)}
                      className="flex-row items-center bg-purple-100 px-4 py-2 rounded-lg"
                    >
                      <Ionicons name="pencil-outline" size={16} color="#8B5CF6" />
                      <Text className="text-purple-600 font-medium ml-2">Editar</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => deleteProduct(index)}
                      className="flex-row items-center bg-red-100 px-4 py-2 rounded-lg"
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                      <Text className="text-red-600 font-medium ml-2">Eliminar</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      )}
      
      <Pressable
        onPress={() => {
          if (isAndroid) {
            drawer.current?.closeDrawer();
          } else {
            setShowDrawer(false);
          }
        }}
        className="p-4 bg-purple-600 rounded-xl mt-4 shadow-sm"
      >
        <Text className="text-white text-center font-bold">Cerrar</Text>
      </Pressable>
    </SafeAreaView>
  );

  const handleAddProduct = () => {
    if (!productName || !price || !quantity || !supermarket || !category) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    
    AsyncStorage.setItem('lastSupermarket', supermarket);
    
    saveCategory(category);
    
    if (isEditMode && editingProductIndex !== null) {
      const updatedProduct: Producto = {
        productName,
        price,
        quantity,
        supermarket,
        category,
        id: producto[editingProductIndex].id
      };

      const newProductos = [...producto];
      const newEnviarLista = [...enviarLista];
      
      newProductos[editingProductIndex] = updatedProduct;
      newEnviarLista[editingProductIndex] = {
        nombre: productName,
        cantidad: quantity,
        price: price,
        supermarket: supermarket,
        category: category,
        formattedDate: formattedDate,
      };

      setProducto(newProductos);
      setEnviarLista(newEnviarLista);
      
      setIsEditMode(false);
      setEditingProductIndex(null);
      
      Alert.alert("✅ Éxito", "Producto actualizado correctamente");
    } else {
      const newProducto: Producto = {
        productName,
        price,
        quantity,
        supermarket,
        category,
        id: Date.now().toString()
      };
      setProducto([...producto, newProducto]);

      const newLista = {
        nombre: productName,
        cantidad: quantity,
        price: price,
        supermarket: supermarket,
        category: category,
        formattedDate: formattedDate,
      };
      setEnviarLista([...enviarLista, newLista]);
    }

    setProductName("");
    setPrice("");
    setQuantity("");
    setCategory("");
    Keyboard.dismiss();
  };
  
  const saveCategory = async (newCategory: string) => {
    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      let categories: string[] = [];
      
      if (storedCategories) {
        categories = JSON.parse(storedCategories);
      }
      
      if (!categories.includes(newCategory)) {
        categories.push(newCategory);
        await AsyncStorage.setItem('categories', JSON.stringify(categories));
      }
    } catch (error) {
      console.error('Error guardando categoría:', error);
    }
  };

  const onDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPurchaseDate(selectedDate);
      const formatted = selectedDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      setFormattedDate(formatted);
    }
  };

  const abrirEnMaps = (direccion: string) => {
    const encodedAddress = encodeURIComponent(direccion);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      direccion
    )}`;
    Linking.openURL(url);
  };

  function renderMainContent() {
    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-8 min-h-screen">
          {/* Header mejorado */}
          <View className="flex-row items-center justify-between mb-6">
            <Logo />
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => {
                  if (isAndroid) {
                    drawer.current?.openDrawer();
                  } else {
                    setShowDrawer(true);
                  }
                }}
                className="bg-white p-3 rounded-full shadow-sm border border-purple-100"
              >
                <View className="flex-row items-center">
                  <Text className="text-purple-600 font-bold mr-1">
                    {producto.length}
                  </Text>
                  <Ionicons name="bag-outline" size={20} color="#8b5cf6" />
                </View>
              </Pressable>
              <Pressable
                onPress={() => setShowMercados(true)}
                className="bg-white p-3 rounded-full shadow-sm border border-purple-100"
              >
                <Ionicons
                  name="storefront-outline"
                  size={24}
                  color="#8b5cf6"
                />
              </Pressable>
            </View>
          </View>

          {/* Stats Card */}
          {producto.length > 0 && (
            <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">📊 Resumen de compra</Text>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-purple-600">{producto.length}</Text>
                  <Text className="text-sm text-gray-600">Productos</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-green-600">${totalProductos.toFixed(2)}</Text>
                  <Text className="text-sm text-gray-600">Total estimado</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-blue-600">
                    {new Set(producto.map(p => p.category)).size}
                  </Text>
                  <Text className="text-sm text-gray-600">Categorías</Text>
                </View>
              </View>
            </View>
          )}

          {/* Widget de accesos rápidos mejorado */}
          <View className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 mb-6">
            <Text className="font-bold text-lg text-gray-800 mb-4">
              🚀 Accesos Rápidos
            </Text>
            <View className="flex-row justify-between">
              <Pressable
                onPress={() => router.push("/ofertas" as any)}
                className="items-center flex-1"
              >
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="gift-outline" size={24} color="#8B5CF6" />
                </View>
                <Text className="text-gray-700 text-xs text-center font-medium">Ofertas</Text>
              </Pressable>
              
              <Pressable
                onPress={() => router.push("/comparador" as any)}
                className="items-center flex-1"
              >
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="git-compare-outline" size={24} color="#3B82F6" />
                </View>
                <Text className="text-gray-700 text-xs text-center font-medium">Comparar</Text>
              </Pressable>
              
              <Pressable
                onPress={() => router.push("/(tabs)/lista-compras" as any)}
                className="items-center flex-1"
              >
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="list-outline" size={24} color="#8B5CF6" />
                </View>
                <Text className="text-gray-700 text-xs text-center font-medium">Listas</Text>
              </Pressable>
              
              <Pressable
                onPress={() => router.push("/configuracion/ajustes" as any)}
                className="items-center flex-1"
              >
                <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="settings-outline" size={24} color="#6B7280" />
                </View>
                <Text className="text-gray-700 text-xs text-center font-medium">Ajustes</Text>
              </Pressable>
            </View>
          </View>

                      {/* Formulario de agregar/editar producto mejorado */}
          <View className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-bold text-xl text-gray-800">
                {isEditMode ? "✏️ Editar producto" : "➕ Agregar producto"}
              </Text>
              {isEditMode && (
                <Pressable
                  onPress={cancelEdit}
                  className="bg-gray-200 px-3 py-1 rounded-lg"
                >
                  <Text className="text-gray-600 text-sm">Cancelar</Text>
                </Pressable>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">
                Nombre del producto
              </Text>
              <TextInput
                className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 text-base"
                placeholder="¿Qué producto compraste?"
                placeholderTextColor="#9ca3af"
                value={productName}
                onChangeText={setProductName}
              />
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-gray-700 font-semibold mb-2">
                  Precio
                </Text>
                <TextInput
                  className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 text-base"
                  placeholder="$0.00"
                  placeholderTextColor="#9ca3af"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 font-semibold mb-2">
                  Cantidad
                </Text>
                <TextInput
                  className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 text-base"
                  placeholder="1"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">
                Categoría
              </Text>
              <Pressable 
                className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 flex-row justify-between items-center"
                onPress={() => setShowCategories(true)}
              >
                <Text className={category ? "text-gray-700" : "text-gray-400"}>
                  {category || "Selecciona una categoría"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
              </Pressable>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">
                Supermercado
              </Text>
              <Pressable 
                className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 flex-row justify-between items-center"
                onPress={() => setShowSupermarkets(true)}
              >
                <Text className={supermarket ? "text-gray-700" : "text-gray-400"}>
                  {supermarket || "Selecciona un supermercado"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
              </Pressable>
            </View>

            <Pressable
              className={`rounded-xl p-4 shadow-sm ${isEditMode ? 'bg-green-600' : 'bg-purple-600'}`}
              onPress={handleAddProduct}
            >
              <Text className="text-white text-center font-bold">
                {isEditMode ? "Actualizar producto" : "Agregar producto"}
              </Text>
            </Pressable>
          </View>

          {/* Fecha de compra */}
          <View className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 mb-6">
            <Text className="font-bold text-xl text-gray-800 mb-3">
              📅 Fecha de compra
            </Text>
            <Pressable
              className="bg-gray-100 border border-gray-200 rounded-xl p-4 flex-row justify-between items-center"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-gray-700 font-medium">
                {formattedDate || "Seleccionar fecha"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
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

          {/* Botón guardar compra mejorado */}
          {producto.length > 0 && (
            <Pressable
              className="bg-green-600 rounded-xl p-4 shadow-sm mb-8"
              onPress={handleAddList}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="save-outline" size={20} color="white" />
                <Text className="text-white text-center font-bold ml-2">
                  Guardar compra (${totalProductos.toFixed(2)})
                </Text>
              </View>
            </Pressable>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-purple-50">
      {isAndroid ? (
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
            {renderMainContent()}
          </KeyboardAvoidingView>
        </DrawerLayoutAndroid>
      ) : (
        <>
          <KeyboardAvoidingView
            behavior="padding"
            className="flex-1"
          >
            {renderMainContent()}
          </KeyboardAvoidingView>
          
          <Modal
            animationType="slide"
            transparent={true}
            visible={showDrawer}
            onRequestClose={() => setShowDrawer(false)}
          >
            <View className="flex-1 bg-black bg-opacity-50">
              <View className="flex-1 w-4/5 ml-auto bg-white">
                <SafeAreaView className="flex-1">
                  {navigationView()}
                </SafeAreaView>
              </View>
            </View>
          </Modal>
        </>
      )}

      <ComerciosModal
        visible={showMercados}
        onClose={() => setShowMercados(false)}
      />

      {/* Modal de Categorías mejorado */}
      {showCategories && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center z-10">
          <View className="bg-white rounded-xl p-6 w-11/12 max-h-3/4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bold text-xl text-gray-800">
                🏷️ Seleccionar Categoría
              </Text>
              <Pressable onPress={() => setShowCategories(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-2">
                {categoriasPredefinidas.map((cat) => (
                  <Pressable
                    key={cat.id}
                    className={`flex-row items-center justify-between p-4 rounded-lg ${
                      category === cat.nombre ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50'
                    }`}
                    onPress={() => {
                      setCategory(cat.nombre);
                      setShowCategories(false);
                    }}
                  >
                    <Text className={`font-medium ${
                      category === cat.nombre ? 'text-purple-700' : 'text-gray-700'
                    }`}>
                      {cat.nombre}
                    </Text>
                    {category === cat.nombre ? (
                      <Ionicons name="checkmark-circle" size={20} color="#8B5CF6" />
                    ) : (
                      <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                    )}
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Modal de Supermercados mejorado */}
      {showSupermarkets && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center z-10">
          <View className="bg-white rounded-xl p-6 w-11/12 max-h-3/4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bold text-xl text-gray-800">
                🏪 Seleccionar Supermercado
              </Text>
              <Pressable onPress={() => setShowSupermarkets(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-2">
                {supermercadosPredefinidos.map((super_market) => (
                  <Pressable
                    key={super_market.id}
                    className={`flex-row items-center justify-between p-4 rounded-lg ${
                      supermarket === super_market.nombre ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50'
                    }`}
                    onPress={() => {
                      setSupermarket(super_market.nombre);
                      setShowSupermarkets(false);
                    }}
                  >
                    <Text className={`font-medium ${
                      supermarket === super_market.nombre ? 'text-purple-700' : 'text-gray-700'
                    }`}>
                      {super_market.nombre}
                    </Text>
                    {supermarket === super_market.nombre ? (
                      <Ionicons name="checkmark-circle" size={20} color="#8B5CF6" />
                    ) : (
                      <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                    )}
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      )}


    </SafeAreaView>
  );
}
