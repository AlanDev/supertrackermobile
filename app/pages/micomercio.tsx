import {
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from 'react'
import Logo from '../components/Logo'
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useComercios, type Product, type Comercio } from "@/context/ComerciosContext";

const micomercio = () => {
  const { misComercio, saveComercio, updateComercio, isLoading } = useComercios();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [comercioData, setComercioData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    categoria: '',
    horarios: '',
    descripcion: ''
  });

  const [productos, setProductos] = useState<Product[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: ''
  });

  // Cargar datos del comercio existente
  useEffect(() => {
    if (misComercio) {
      setComercioData({
        nombre: misComercio.nombre,
        direccion: misComercio.direccion,
        telefono: misComercio.telefono,
        categoria: misComercio.categoria,
        horarios: misComercio.horarios,
        descripcion: misComercio.descripcion
      });
      setProductos(misComercio.productos);
      setIsEditing(true);
    }
  }, [misComercio]);

  const logo = () => {
    router.push("/(tabs)")
  }

  const handleInputChange = (field: string, value: string) => {
    setComercioData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  const addProduct = () => {
    if (newProduct.name && newProduct.price) {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category
      };
      setProductos([...productos, product]);
      setNewProduct({ name: '', price: '', category: '' });
      setShowProductModal(false);
    } else {
      Alert.alert('Error', 'Por favor completa el nombre y precio del producto');
    }
  }

  const removeProduct = (id: string) => {
    setProductos(productos.filter(product => product.id !== id));
  }

  const handleSaveComercio = async () => {
    if (!comercioData.nombre || !comercioData.direccion) {
      Alert.alert('Error', 'Por favor completa al menos el nombre y dirección del comercio');
      return;
    }
    
    setIsSaving(true);
    
    const comercioToSave = {
      ...comercioData,
      productos
    };
    
    try {
      let success;
      if (isEditing && misComercio) {
        success = await updateComercio(misComercio.id, comercioToSave);
      } else {
        success = await saveComercio(comercioToSave);
        setIsEditing(true);
      }
      
      if (success) {
        Alert.alert('Éxito', `Comercio ${isEditing ? 'actualizado' : 'guardado'} correctamente`);
      } else {
        Alert.alert('Error', 'No se pudo guardar el comercio. Intenta nuevamente.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error inesperado');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-purple-50 justify-center items-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-gray-600 mt-4">Cargando comercio...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-purple-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1">
        <View className="flex-1 px-6 py-8">
          <Pressable onPress={logo}>
            <Logo/>
          </Pressable>

          <View className="flex-row items-center justify-between mb-6">
            <Text className="font-semibold text-2xl text-gray-800">
              {isEditing ? 'Editar Mi Comercio' : 'Crear Mi Comercio'}
            </Text>
            <View className="flex-row space-x-2">
              {isEditing && (
                <Pressable 
                  onPress={() => {
                    setComercioData({
                      nombre: '',
                      direccion: '',
                      telefono: '',
                      categoria: '',
                      horarios: '',
                      descripcion: ''
                    });
                    setProductos([]);
                    setIsEditing(false);
                  }}
                  className="bg-gray-500 px-3 py-2 rounded-lg"
                >
                  <Text className="text-white font-semibold text-sm">Nuevo</Text>
                </Pressable>
              )}
              <Pressable 
                onPress={handleSaveComercio}
                disabled={isSaving}
                className={`${isSaving ? 'bg-purple-400' : 'bg-purple-600'} px-4 py-2 rounded-lg`}
              >
                {isSaving ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white font-semibold">
                    {isEditing ? 'Actualizar' : 'Guardar'}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>

          {/* Información básica del comercio */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Información Básica</Text>
            
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Nombre del Comercio *</Text>
              <TextInput
                value={comercioData.nombre}
                onChangeText={(text) => handleInputChange('nombre', text)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800"
                placeholder="Ej: Mi Supermercado"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Dirección *</Text>
              <TextInput
                value={comercioData.direccion}
                onChangeText={(text) => handleInputChange('direccion', text)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800"
                placeholder="Ej: Av. Corrientes 1234"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Teléfono</Text>
              <TextInput
                value={comercioData.telefono}
                onChangeText={(text) => handleInputChange('telefono', text)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800"
                placeholder="Ej: +54 11 1234-5678"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Categoría</Text>
              <TextInput
                value={comercioData.categoria}
                onChangeText={(text) => handleInputChange('categoria', text)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800"
                placeholder="Ej: Supermercado, Farmacia, Panadería"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Horarios de Atención</Text>
              <TextInput
                value={comercioData.horarios}
                onChangeText={(text) => handleInputChange('horarios', text)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800"
                placeholder="Ej: Lun-Vie 8:00-20:00, Sáb 8:00-18:00"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Descripción</Text>
              <TextInput
                value={comercioData.descripcion}
                onChangeText={(text) => handleInputChange('descripcion', text)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800"
                placeholder="Describe tu comercio..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Productos */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-800">Productos</Text>
              <Pressable 
                onPress={() => setShowProductModal(true)}
                className="bg-green-600 px-3 py-2 rounded-lg flex-row items-center"
              >
                <Ionicons name="add" size={16} color="white" />
                <Text className="text-white font-semibold ml-1">Agregar</Text>
              </Pressable>
            </View>

            {productos.length === 0 ? (
              <View className="items-center py-8">
                <Ionicons name="basket-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2">No hay productos agregados</Text>
                <Text className="text-gray-400 text-sm">Presiona "Agregar" para añadir productos</Text>
              </View>
            ) : (
              productos.map((producto) => (
                <View key={producto.id} className="flex-row items-center justify-between bg-gray-50 rounded-lg p-3 mb-2">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800">{producto.name}</Text>
                    <Text className="text-green-600 font-bold">${producto.price}</Text>
                    {producto.category && (
                      <Text className="text-gray-500 text-sm">{producto.category}</Text>
                    )}
                  </View>
                  <Pressable 
                    onPress={() => removeProduct(producto.id)}
                    className="bg-red-500 p-2 rounded-lg"
                  >
                    <Ionicons name="trash-outline" size={16} color="white" />
                  </Pressable>
                </View>
              ))
            )}
          </View>

          {/* Vista previa del comercio */}
          {comercioData.nombre && (
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Vista Previa</Text>
              <View className="bg-purple-50 rounded-lg p-4">
                <Text className="text-xl font-bold text-purple-700 text-center mb-2">
                  {comercioData.nombre}
                </Text>
                {comercioData.categoria && (
                  <Text className="text-gray-600 text-center mb-2">
                    Categoría: {comercioData.categoria}
                  </Text>
                )}
                <Text className="text-gray-700 mb-1">
                  📍 {comercioData.direccion}
                </Text>
                {comercioData.telefono && (
                  <Text className="text-gray-700 mb-1">
                    📞 {comercioData.telefono}
                  </Text>
                )}
                {comercioData.horarios && (
                  <Text className="text-gray-700 mb-2">
                    🕒 {comercioData.horarios}
                  </Text>
                )}
                {comercioData.descripcion && (
                  <Text className="text-gray-600 italic">
                    {comercioData.descripcion}
                  </Text>
                )}
                {productos.length > 0 && (
                  <Text className="text-purple-600 font-semibold mt-2">
                    {productos.length} producto{productos.length > 1 ? 's' : ''} disponible{productos.length > 1 ? 's' : ''}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal para agregar productos */}
      <Modal
        visible={showProductModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white rounded-xl p-6 m-4 w-11/12">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-800">Agregar Producto</Text>
              <Pressable onPress={() => setShowProductModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Nombre del Producto *</Text>
              <TextInput
                value={newProduct.name}
                onChangeText={(text) => setNewProduct({...newProduct, name: text})}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800"
                placeholder="Ej: Leche entera 1L"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-2">Precio *</Text>
              <TextInput
                value={newProduct.price}
                onChangeText={(text) => setNewProduct({...newProduct, price: text})}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800"
                placeholder="Ej: 250"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-600 font-medium mb-2">Categoría</Text>
              <TextInput
                value={newProduct.category}
                onChangeText={(text) => setNewProduct({...newProduct, category: text})}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800"
                placeholder="Ej: Lácteos"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="flex-row space-x-3">
              <Pressable 
                onPress={() => setShowProductModal(false)}
                className="flex-1 bg-gray-200 py-3 rounded-lg"
              >
                <Text className="text-gray-700 text-center font-semibold">Cancelar</Text>
              </Pressable>
              <Pressable 
                onPress={addProduct}
                className="flex-1 bg-green-600 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">Agregar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

export default micomercio