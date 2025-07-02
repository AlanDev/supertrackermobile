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
  Image,
} from "react-native";
import React, { useState, useEffect } from 'react'
import { Logo } from '../../atoms/Logo'
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useComercios, type Product, type Comercio } from "../context/ComerciosContext";

const micomercio = () => {
  const { misComercio, saveComercio, updateComercio, deleteComercio, isLoading } = useComercios();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchProducts, setSearchProducts] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: ''
  });

  const categoriasComercio = [
    { id: 1, nombre: 'Supermercado', icono: '🛒', color: 'bg-blue-100 text-blue-700' },
    { id: 2, nombre: 'Farmacia', icono: '💊', color: 'bg-green-100 text-green-700' },
    { id: 3, nombre: 'Panadería', icono: '🍞', color: 'bg-orange-100 text-orange-700' },
    { id: 4, nombre: 'Carnicería', icono: '🥩', color: 'bg-red-100 text-red-700' },
    { id: 5, nombre: 'Verdulería', icono: '🥕', color: 'bg-green-100 text-green-700' },
    { id: 6, nombre: 'Bebidas', icono: '🥤', color: 'bg-purple-100 text-purple-700' },
    { id: 7, nombre: 'Limpieza', icono: '🧽', color: 'bg-cyan-100 text-cyan-700' },
    { id: 8, nombre: 'Otros', icono: '🏪', color: 'bg-gray-100 text-gray-700' }
  ];

  const categoriasProductos = ['Lácteos', 'Carnes', 'Frutas y Verduras', 'Bebidas', 'Limpieza', 'Higiene Personal', 'Panadería', 'Congelados', 'Almacén', 'Otros'];

  useEffect(() => {
    if (misComercio && misComercio.id) {
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
    } else {
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

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setNewProduct({
        name: product.name,
        price: product.price,
        category: product.category
      });
    } else {
      setEditingProduct(null);
      setNewProduct({ name: '', price: '', category: '' });
    }
    setShowProductModal(true);
  }

  const saveProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      Alert.alert('Error', 'Por favor completa el nombre y precio del producto');
      return;
    }

    if (editingProduct) {
      const updatedProducts = productos.map(p => 
        p.id === editingProduct.id 
          ? { ...p, name: newProduct.name, price: newProduct.price, category: newProduct.category }
          : p
      );
      setProductos(updatedProducts);
    } else {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category
      };
      setProductos([...productos, product]);
    }
    
    setNewProduct({ name: '', price: '', category: '' });
    setEditingProduct(null);
    setShowProductModal(false);
  }

  const deleteProduct = (id: string) => {
    Alert.alert(
      'Eliminar Producto',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => setProductos(productos.filter(product => product.id !== id))
        }
      ]
    );
  }

  const handleDeleteComercio = () => {
    Alert.alert(
      'Eliminar Comercio',
      '¿Estás seguro de que deseas eliminar tu comercio? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            if (misComercio) {
              const success = await deleteComercio(misComercio.id);
              if (success) {
                Alert.alert('Éxito', 'Comercio eliminado correctamente');
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
              } else {
                Alert.alert('Error', 'No se pudo eliminar el comercio');
              }
            }
          }
        }
      ]
    );
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
        Alert.alert('✅ Éxito', `Comercio ${isEditing ? 'actualizado' : 'guardado'} correctamente`);
      } else {
        Alert.alert('❌ Error', 'No se pudo guardar el comercio. Intenta nuevamente.');
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Ocurrió un error inesperado');
    } finally {
      setIsSaving(false);
    }
  }

  const filteredProducts = productos.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchProducts.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = productos.length;
  const totalCategories = new Set(productos.map(p => p.category)).size;
  const averagePrice = productos.length > 0 ? productos.reduce((sum, p) => sum + parseFloat(p.price), 0) / productos.length : 0;
  const maxPrice = productos.length > 0 ? Math.max(...productos.map(p => parseFloat(p.price))) : 0;

  if (isLoading) {
    return (
      <View className="flex-1 bg-purple-50 justify-center items-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-gray-600 mt-4 font-medium">Cargando comercio...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-purple-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-8">
          {/* Header mejorado */}
          <View className="flex-row items-center justify-between mb-8">
            <Pressable onPress={logo}>
              <Logo/>
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-purple-100"
            >
              <Ionicons name="close" size={24} color="#8B5CF6" />
            </Pressable>
          </View>

          {/* Título con avatar del comercio */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-purple-500 rounded-2xl items-center justify-center mr-4 shadow-lg">
                <Text className="text-3xl">
                  {categoriasComercio.find(c => c.nombre === comercioData.categoria)?.icono || '🏪'}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-3xl text-gray-900 mb-1">
                  {isEditing ? comercioData.nombre || 'Mi Comercio' : 'Crear Comercio'}
                </Text>
                <Text className="text-purple-600 text-base font-medium">
                  {isEditing ? 'Gestiona tu negocio' : 'Configura tu comercio para empezar'}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Dashboard mejorado */}
          {isEditing && (
            <View className="mb-8">
              <Text className="text-xl font-bold text-gray-900 mb-4">📊 Dashboard</Text>
              <View className="flex-row justify-between mb-4">
                <View className="bg-white rounded-2xl p-4 flex-1 mr-2 shadow-sm border border-purple-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-purple-600 text-sm font-bold">PRODUCTOS</Text>
                    <Ionicons name="cube" size={16} color="#8B5CF6" />
                  </View>
                  <Text className="text-2xl font-bold text-gray-900">{totalProducts}</Text>
                  <Text className="text-xs text-gray-500">Total registrados</Text>
                </View>
                <View className="bg-white rounded-2xl p-4 flex-1 ml-2 shadow-sm border border-purple-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-green-600 text-sm font-bold">CATEGORÍAS</Text>
                    <Ionicons name="apps" size={16} color="#10B981" />
                  </View>
                  <Text className="text-2xl font-bold text-gray-900">{totalCategories}</Text>
                  <Text className="text-xs text-gray-500">Diferentes tipos</Text>
                </View>
              </View>
              <View className="flex-row justify-between">
                <View className="bg-white rounded-2xl p-4 flex-1 mr-2 shadow-sm border border-purple-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-blue-600 text-sm font-bold">PRECIO PROM.</Text>
                    <Ionicons name="trending-up" size={16} color="#3B82F6" />
                  </View>
                  <Text className="text-2xl font-bold text-gray-900">${averagePrice.toFixed(0)}</Text>
                  <Text className="text-xs text-gray-500">Por producto</Text>
                </View>
                <View className="bg-white rounded-2xl p-4 flex-1 ml-2 shadow-sm border border-purple-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-orange-600 text-sm font-bold">MÁS CARO</Text>
                    <Ionicons name="star" size={16} color="#F59E0B" />
                  </View>
                  <Text className="text-2xl font-bold text-gray-900">${maxPrice.toFixed(0)}</Text>
                  <Text className="text-xs text-gray-500">Precio máximo</Text>
                </View>
              </View>
            </View>
          )}

          {/* Información básica del comercio mejorada */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <View className="flex-row items-center mb-6">
              <Ionicons name="business" size={24} color="#8B5CF6" />
              <Text className="text-xl font-bold text-gray-900 ml-3">Información del Negocio</Text>
            </View>
            
            <View className="mb-5">
              <Text className="text-gray-700 font-semibold mb-3">Nombre del Comercio *</Text>
              <TextInput
                value={comercioData.nombre}
                onChangeText={(text) => handleInputChange('nombre', text)}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-800 focus:border-purple-500"
                placeholder="Ej: Mi Supermercado"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-5">
              <Text className="text-gray-700 font-semibold mb-3">Dirección *</Text>
              <TextInput
                value={comercioData.direccion}
                onChangeText={(text) => handleInputChange('direccion', text)}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-800 focus:border-purple-500"
                placeholder="Ej: Av. Corrientes 1234, CABA"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={2}
              />
            </View>

            <View className="flex-row gap-4 mb-5">
              <View className="flex-1">
                <Text className="text-gray-700 font-semibold mb-3">Teléfono</Text>
                <TextInput
                  value={comercioData.telefono}
                  onChangeText={(text) => handleInputChange('telefono', text)}
                  className="bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-800 focus:border-purple-500"
                  placeholder="+54 11 1234-5678"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 font-semibold mb-3">Categoría</Text>
                <Pressable 
                  className="bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 flex-row justify-between items-center"
                  onPress={() => setShowCategoryModal(true)}
                >
                  <View className="flex-row items-center">
                    {comercioData.categoria && (
                      <Text className="text-lg mr-2">
                        {categoriasComercio.find(c => c.nombre === comercioData.categoria)?.icono}
                      </Text>
                    )}
                    <Text className={comercioData.categoria ? "text-gray-700" : "text-gray-400"}>
                      {comercioData.categoria || "Seleccionar"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                </Pressable>
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-gray-700 font-semibold mb-3">Horarios de Atención</Text>
              <TextInput
                value={comercioData.horarios}
                onChangeText={(text) => handleInputChange('horarios', text)}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-800 focus:border-purple-500"
                placeholder="Lun a Vie: 9:00 - 20:00, Sáb: 9:00 - 18:00"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-3">Descripción del Negocio</Text>
              <TextInput
                value={comercioData.descripcion}
                onChangeText={(text) => handleInputChange('descripcion', text)}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-800 focus:border-purple-500"
                placeholder="Describe tu comercio, servicios especiales, productos destacados..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Gestión de productos mejorada */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <Ionicons name="cube" size={24} color="#8B5CF6" />
                <View className="ml-3">
                  <Text className="text-xl font-bold text-gray-900">Inventario</Text>
                  <Text className="text-gray-500 text-sm">{productos.length} productos registrados</Text>
                </View>
              </View>
              <Pressable
                onPress={() => openProductModal()}
                className="bg-purple-600 px-4 py-3 rounded-xl shadow-lg"
              >
                <View className="flex-row items-center">
                  <Ionicons name="add" size={18} color="white" />
                  <Text className="text-white font-semibold ml-2">Agregar</Text>
                </View>
              </Pressable>
            </View>

            {/* Búsqueda y filtros */}
            {productos.length > 0 && (
              <View className="mb-6">
                <View className="flex-row gap-3 mb-4">
                  <View className="flex-1">
                    <TextInput
                      value={searchProducts}
                      onChangeText={setSearchProducts}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                      placeholder="Buscar productos..."
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  <Pressable className="bg-gray-100 px-4 py-3 rounded-xl items-center justify-center">
                    <Ionicons name="search" size={20} color="#6B7280" />
                  </Pressable>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => setSelectedCategory('Todas')}
                      className={`px-4 py-2 rounded-full border ${
                        selectedCategory === 'Todas' 
                          ? 'bg-purple-500 border-purple-500' 
                          : 'bg-gray-100 border-gray-200'
                      }`}
                    >
                      <Text className={`text-sm font-medium ${
                        selectedCategory === 'Todas' ? 'text-white' : 'text-gray-700'
                      }`}>
                        Todas
                      </Text>
                    </Pressable>
                    {Array.from(new Set(productos.map(p => p.category))).map((category) => (
                      <Pressable
                        key={category}
                        onPress={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full border ${
                          selectedCategory === category 
                            ? 'bg-purple-500 border-purple-500' 
                            : 'bg-gray-100 border-gray-200'
                        }`}
                      >
                        <Text className={`text-sm font-medium ${
                          selectedCategory === category ? 'text-white' : 'text-gray-700'
                        }`}>
                          {category}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {productos.length === 0 ? (
              <View className="bg-gray-50 rounded-2xl p-8 items-center">
                <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
                  <Ionicons name="cube-outline" size={40} color="#8B5CF6" />
                </View>
                <Text className="text-gray-900 font-bold text-lg mb-2">¡Hora de agregar productos!</Text>
                <Text className="text-gray-600 text-center text-sm mb-6">
                  Comienza agregando productos para que tus clientes puedan encontrarlos fácilmente
                </Text>
                <Pressable
                  onPress={() => openProductModal()}
                  className="bg-purple-500 px-6 py-3 rounded-xl"
                >
                  <Text className="text-white font-semibold">Agregar Primer Producto</Text>
                </Pressable>
              </View>
            ) : (
              <View className="space-y-3">
                {filteredProducts.map((producto, index) => (
                  <View key={producto.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1 mr-4">
                        <Text className="font-bold text-gray-900 text-lg mb-1">{producto.name}</Text>
                        <View className="flex-row items-center">
                          <View className="bg-purple-100 px-3 py-1 rounded-full mr-2">
                            <Text className="text-purple-700 text-xs font-semibold">{producto.category}</Text>
                          </View>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-2xl font-bold text-purple-600">${producto.price}</Text>
                        <Text className="text-gray-500 text-xs">por unidad</Text>
                      </View>
                    </View>
                    <View className="flex-row justify-end gap-2">
                      <Pressable
                        onPress={() => openProductModal(producto)}
                        className="flex-row items-center bg-blue-100 px-4 py-2 rounded-lg"
                      >
                        <Ionicons name="pencil" size={16} color="#3B82F6" />
                        <Text className="text-blue-600 font-semibold ml-2">Editar</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => deleteProduct(producto.id)}
                        className="flex-row items-center bg-red-100 px-4 py-2 rounded-lg"
                      >
                        <Ionicons name="trash" size={16} color="#EF4444" />
                        <Text className="text-red-600 font-semibold ml-2">Eliminar</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
                
                {filteredProducts.length === 0 && searchProducts && (
                  <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 items-center">
                    <Ionicons name="search" size={32} color="#F59E0B" />
                    <Text className="text-yellow-800 font-semibold mt-2">No se encontraron productos</Text>
                    <Text className="text-yellow-700 text-sm text-center mt-1">
                      Intenta con otros términos de búsqueda
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Botones de acción mejorados */}
          <View className="space-y-6 mb-8">
            {/* Botón principal de guardar/actualizar */}
            <Pressable 
              onPress={handleSaveComercio}
              disabled={isSaving}
              className={`rounded-2xl overflow-hidden shadow-xl ${
                isSaving ? 'opacity-70' : ''
              }`}
              style={{
                shadowColor: '#8B5CF6',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <View className={`${isSaving ? 'bg-purple-400' : 'bg-purple-600'} p-6`}>
                {isSaving ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator color="white" size="small" />
                    <Text className="text-white font-bold text-lg ml-3">Guardando...</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center justify-center">
                    <View className="w-12 h-12 bg-white bg-opacity-20 rounded-full items-center justify-center mr-4">
                      <Text className="text-white text-2xl font-bold">
                        {isEditing ? "💾" : "✨"}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-xl">
                        {isEditing ? 'Actualizar Comercio' : 'Crear Mi Comercio'}
                      </Text>
                      <Text className="text-purple-100 text-sm">
                        {isEditing ? 'Guardar todos los cambios realizados' : 'Comenzar a vender con tu negocio'}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </Pressable>

            {/* Botones secundarios cuando está editando */}
            {isEditing && (
              <View className="space-y-4">
                <Text className="text-gray-600 font-semibold text-center mb-2">Otras acciones</Text>
                
                <View className="flex-row gap-4">
                  {/* Botón Nuevo Comercio */}
                  <Pressable 
                    onPress={() => {
                      Alert.alert(
                        'Nuevo Comercio',
                        '¿Estás seguro? Se perderán todos los cambios no guardados.',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          {
                            text: 'Continuar',
                            onPress: () => {
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
                            }
                          }
                        ]
                      );
                    }}
                    className="flex-1 bg-white border-2 border-gray-200 rounded-2xl overflow-hidden"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 6,
                    }}
                  >
                    <View className="p-5">
                      <View className="flex-row items-center justify-center mb-2">
                        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                          <Ionicons name="add-circle" size={22} color="#3B82F6" />
                        </View>
                        <Text className="text-gray-900 font-bold text-lg">Nuevo</Text>
                      </View>
                      <Text className="text-gray-600 text-sm text-center">
                        Crear otro comercio desde cero
                      </Text>
                    </View>
                  </Pressable>
                  
                  {/* Botón Eliminar Comercio */}
                  <Pressable 
                    onPress={handleDeleteComercio}
                    className="flex-1 bg-white border-2 border-red-200 rounded-2xl overflow-hidden"
                    style={{
                      shadowColor: '#EF4444',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.15,
                      shadowRadius: 8,
                      elevation: 6,
                    }}
                  >
                    <View className="p-5">
                      <View className="flex-row items-center justify-center mb-2">
                        <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
                          <Ionicons name="trash" size={22} color="#EF4444" />
                        </View>
                        <Text className="text-red-600 font-bold text-lg">Eliminar</Text>
                      </View>
                      <Text className="text-red-500 text-sm text-center">
                        Borrar comercio permanentemente
                      </Text>
                    </View>
                  </Pressable>
                </View>

                {/* Información adicional */}
                <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                  <View className="flex-row items-center">
                    <Ionicons name="information-circle" size={20} color="#3B82F6" />
                    <Text className="text-blue-800 font-semibold ml-2">Tip</Text>
                  </View>
                  <Text className="text-blue-700 text-sm mt-2">
                    Recuerda guardar tus cambios antes de realizar otras acciones. Los datos no guardados se perderán.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal para seleccionar categoría del comercio */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md max-h-3/4">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-bold text-xl text-gray-800">
                🏪 Tipo de Comercio
              </Text>
              <Pressable onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-3">
                {categoriasComercio.map((cat) => (
                  <Pressable
                    key={cat.id}
                    className={`flex-row items-center p-4 rounded-xl border-2 ${
                      comercioData.categoria === cat.nombre 
                        ? 'bg-purple-50 border-purple-300' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    onPress={() => {
                      setComercioData(prev => ({ ...prev, categoria: cat.nombre }));
                      setShowCategoryModal(false);
                    }}
                  >
                    <Text className="text-2xl mr-4">{cat.icono}</Text>
                    <View className="flex-1">
                      <Text className={`font-semibold ${
                        comercioData.categoria === cat.nombre ? 'text-purple-700' : 'text-gray-700'
                      }`}>
                        {cat.nombre}
                      </Text>
                    </View>
                    {comercioData.categoria === cat.nombre && (
                      <Ionicons name="checkmark-circle" size={24} color="#8B5CF6" />
                    )}
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar/editar producto mejorado */}
      <Modal
        visible={showProductModal}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-purple-100 rounded-xl items-center justify-center mr-3">
                  <Ionicons name={editingProduct ? "pencil" : "add"} size={24} color="#8B5CF6" />
                </View>
                <Text className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </Text>
              </View>
              <Pressable onPress={() => setShowProductModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-5">
                <Text className="text-gray-700 font-semibold mb-3">Nombre del producto *</Text>
                <TextInput
                  value={newProduct.name}
                  onChangeText={(text) => setNewProduct(prev => ({ ...prev, name: text }))}
                  className="bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-800 focus:border-purple-500"
                  placeholder="Ej: Coca Cola 2.25L"
                  placeholderTextColor="#9CA3AF"
                  autoFocus
                />
              </View>

              <View className="flex-row gap-3 mb-5">
                <View className="flex-1">
                  <Text className="text-gray-700 font-semibold mb-3">Precio *</Text>
                  <View className="relative">
                    <TextInput
                      value={newProduct.price}
                      onChangeText={(text) => setNewProduct(prev => ({ ...prev, price: text }))}
                      className="bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-800 focus:border-purple-500 pl-8"
                      placeholder="0.00"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                    />
                    <Text className="absolute left-3 top-4 text-gray-500 font-semibold">$</Text>
                  </View>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-700 font-semibold mb-3">Categoría</Text>
                  <TextInput
                    value={newProduct.category}
                    onChangeText={(text) => setNewProduct(prev => ({ ...prev, category: text }))}
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-800 focus:border-purple-500"
                    placeholder="Bebidas"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Categorías sugeridas */}
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-3">Categorías sugeridas:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {categoriasProductos.map((cat) => (
                      <Pressable
                        key={cat}
                        onPress={() => setNewProduct(prev => ({ ...prev, category: cat }))}
                        className={`px-3 py-2 rounded-full border ${
                          newProduct.category === cat 
                            ? 'bg-purple-500 border-purple-500' 
                            : 'bg-gray-100 border-gray-200'
                        }`}
                      >
                        <Text className={`text-sm font-medium ${
                          newProduct.category === cat ? 'text-white' : 'text-gray-700'
                        }`}>
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => setShowProductModal(false)}
                  className="flex-1 bg-gray-200 py-4 rounded-xl"
                >
                  <Text className="text-gray-700 text-center font-semibold">Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={saveProduct}
                  className="flex-1 bg-purple-600 py-4 rounded-xl"
                  disabled={!newProduct.name.trim() || !newProduct.price.trim()}
                >
                  <Text className="text-white text-center font-semibold">
                    {editingProduct ? 'Actualizar' : 'Agregar'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

export default micomercio