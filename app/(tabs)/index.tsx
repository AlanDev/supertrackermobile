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
  // Nuevo estado para el drawer modal compatible con iOS
  const [showDrawer, setShowDrawer] = useState(false);
  
  // Nuevo estado para controlar modal de categorías
  const [showCategories, setShowCategories] = useState(false);
  
  // Listas predefinidas de supermercados y categorías
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
  
  // Determinar la plataforma
  const isAndroid = Platform.OS === 'android';

  // Estado para el total de los productos
  const [totalProductos, setTotalProductos] = useState(0);
  
  // Efecto para cargar el último supermercado seleccionado
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
  
  // Calcular el total cada vez que se actualiza la lista de productos
  useEffect(() => {
    const total = producto.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity));
    }, 0);
    
    setTotalProductos(total);
  }, [producto]);

  const handleAddList = async () => {
    try {
      if (enviarLista.length === 0) {
        Alert.alert("Error", "No hay productos en la lista");
        return;
      }

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

      // Guardar productos en formato para estadísticas
      const existingStatsProducts = await AsyncStorage.getItem("homeProducts");
      let statsProducts = [];

      if (existingStatsProducts) {
        statsProducts = JSON.parse(existingStatsProducts);
      }

      // Convertir productos al formato necesario para estadísticas
      const statsFormattedProducts = enviarLista.map(item => ({
        name: item.nombre,
        cantidad: parseInt(item.cantidad),
        gasto: parseFloat(item.price) * parseInt(item.cantidad),
        category: item.category
      }));

      const updatedStatsProducts = [...statsProducts, ...statsFormattedProducts];
      await AsyncStorage.setItem("homeProducts", JSON.stringify(updatedStatsProducts));

      // Limpiar la lista después de guardar
      setEnviarLista([]);
      setProducto([]);
      
      console.log("Compra guardada:", {
        productosNuevos: enviarLista,
        totalCompra: total,
        historial: updatedHistory,
      });
      
      Alert.alert("Éxito", "Compra guardada correctamente", [
        {
          text: "Ver estadísticas",
          onPress: () => router.push("/(tabs)/estadisticas"),
        },
        {
          text: "OK",
          style: "default"
        }
      ]);
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
        <>
          <View className="bg-purple-50 p-4 rounded-xl mb-4">
            <Text className="text-gray-700 font-medium">Total actual:</Text>
            <Text className="text-2xl font-bold text-purple-600">${totalProductos.toFixed(2)}</Text>
          </View>
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
      Alert.alert("Por favor completa todos los campos");
      return;
    }
    
    // Guardar el último supermercado seleccionado
    AsyncStorage.setItem('lastSupermarket', supermarket);
    
    // Guardar la categoría en lista de categorías
    saveCategory(category);
    
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
    // No limpiamos el supermercado para mantenerlo para el próximo producto
    // setSupermarket("");
    setCategory("");
    Keyboard.dismiss();
  };
  
  // Función para guardar categoría en AsyncStorage
  const saveCategory = async (newCategory: string) => {
    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      let categories: string[] = [];
      
      if (storedCategories) {
        categories = JSON.parse(storedCategories);
      }
      
      // Solo añadir si no existe ya
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
      {isAndroid ? (
        <DrawerLayoutAndroid
          ref={drawer}
          drawerWidth={300}
          drawerPosition={drawerPosition}
          renderNavigationView={navigationView}
          style={{ flex: 1 }}
        >
          {/* Contenido principal */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            {renderMainContent()}
          </KeyboardAvoidingView>
        </DrawerLayoutAndroid>
      ) : (
        // Versión iOS-compatible
        <>
          <KeyboardAvoidingView
            behavior="padding"
            className="flex-1"
          >
            {renderMainContent()}
          </KeyboardAvoidingView>
          
          {/* Modal para iOS en lugar del drawer */}
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

      {/* Comercios Modal */}
      <ComerciosModal
        visible={showMercados}
        onClose={() => setShowMercados(false)}
      />

      {/* Modal de Categorías */}
      {showCategories && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center z-10">
          <View className="bg-white rounded-xl p-6 w-11/12 max-h-3/4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bold text-xl text-gray-800">
                Categorías
              </Text>
              <Pressable onPress={() => setShowCategories(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <ScrollView>
              <View className="space-y-3">
                {categoriasPredefinidas.map((cat) => (
                  <Pressable
                    key={cat.id}
                    className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg"
                    onPress={() => {
                      setCategory(cat.nombre);
                      setShowCategories(false);
                    }}
                  >
                    <Text className="text-gray-700">{cat.nombre}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                  </Pressable>
                ))}
                
                <View className="mt-3 pt-3 border-t border-gray-200">
                  <Text className="text-gray-600 mb-2">O ingresa una categoría personalizada:</Text>
                  <View className="flex-row">
                    <TextInput
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 mr-2"
                      placeholder="Nueva categoría"
                      value={category}
                      onChangeText={setCategory}
                    />
                    <Pressable
                      className="bg-purple-600 p-3 rounded-lg"
                      onPress={() => setShowCategories(false)}
                    >
                      <Text className="text-white font-medium">Guardar</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Modal de Supermercados - reemplazamos el existente */}
      {showSupermarkets && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center z-10">
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
                {supermercadosPredefinidos.map((super_) => (
                  <Pressable
                    key={super_.id}
                    className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg"
                    onPress={() => {
                      setSupermarket(super_.nombre);
                      setShowSupermarkets(false);
                    }}
                  >
                    <Text className="text-gray-700">{super_.nombre}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                  </Pressable>
                ))}
                
                <View className="mt-3 pt-3 border-t border-gray-200">
                  <Text className="text-gray-600 mb-2">O ingresa un supermercado personalizado:</Text>
                  <View className="flex-row">
                    <TextInput
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 mr-2"
                      placeholder="Nuevo supermercado"
                      value={supermarket}
                      onChangeText={setSupermarket}
                    />
                    <Pressable
                      className="bg-purple-600 p-3 rounded-lg"
                      onPress={() => setShowSupermarkets(false)}
                    >
                      <Text className="text-white font-medium">Guardar</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );

  // Función para renderizar el contenido principal y reutilizarlo
  function renderMainContent() {
    return (
      <ScrollView className="flex-1">
        <View className="flex-1 px-6 py-8 min-h-screen">
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
            <Pressable 
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-5 flex-row justify-between items-center"
              onPress={() => setShowCategories(true)}
            >
              <Text className={category ? "text-gray-700" : "text-gray-400"}>
                {category || "Selecciona una categoría"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#9ca3af" />
            </Pressable>

            <Text className="text-gray-600 font-medium mb-1">
              Supermercado
            </Text>
            <Pressable 
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-5 flex-row justify-between items-center"
              onPress={() => setShowSupermarkets(true)}
            >
              <Text className={supermarket ? "text-gray-700" : "text-gray-400"}>
                {supermarket || "Selecciona un supermercado"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#9ca3af" />
            </Pressable>

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
    );
  }
}
