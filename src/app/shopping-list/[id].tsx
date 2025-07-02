import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProductoLista {
  id: string;
  nombre: string;
  cantidad: number;
  precio?: number;
  comprado: boolean;
  categoria: string;
}

interface ListaCompra {
  id: string;
  nombre: string;
  fecha: string;
  productos: ProductoLista[];
  completada: boolean;
  total: number;
}

export default function DetalleListaScreen() {
  const { id } = useLocalSearchParams();
  const [lista, setLista] = useState<ListaCompra | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductoLista | null>(null);
  const [nuevoProducto, setNuevoProducto] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('Otros');
  const [showCategorias, setShowCategorias] = useState(false);
  const [showSupermercados, setShowSupermercados] = useState(false);
  const [selectedSupermarket, setSelectedSupermarket] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const categorias = ['Lácteos', 'Carnes', 'Frutas y Verduras', 'Bebidas', 'Limpieza', 'Higiene Personal', 'Panadería', 'Congelados', 'Almacén', 'Otros'];
  
  const categoriasConIconos = [
    { nombre: 'Lácteos', icono: '🥛' },
    { nombre: 'Carnes', icono: '🥩' },
    { nombre: 'Frutas y Verduras', icono: '🥕' },
    { nombre: 'Bebidas', icono: '🥤' },
    { nombre: 'Limpieza', icono: '🧽' },
    { nombre: 'Higiene Personal', icono: '🧴' },
    { nombre: 'Panadería', icono: '🍞' },
    { nombre: 'Congelados', icono: '🧊' },
    { nombre: 'Almacén', icono: '📦' },
    { nombre: 'Otros', icono: '🛒' }
  ];
  
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

  useEffect(() => {
    loadLista();
  }, []);

  const loadLista = async () => {
    try {
      const savedListas = await AsyncStorage.getItem('shopping_lists');
      if (savedListas) {
        const listas = JSON.parse(savedListas);
        const listaEncontrada = listas.find((l: ListaCompra) => l.id === id);
        setLista(listaEncontrada || null);
      }
    } catch (error) {
      console.error('Error loading list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLista = async (listaActualizada: ListaCompra) => {
    try {
      const savedListas = await AsyncStorage.getItem('shopping_lists');
      if (savedListas) {
        const listas = JSON.parse(savedListas);
        const index = listas.findIndex((l: ListaCompra) => l.id === id);
        if (index !== -1) {
          listas[index] = listaActualizada;
          await AsyncStorage.setItem('shopping_lists', JSON.stringify(listas));
          setLista(listaActualizada);
        }
      }
    } catch (error) {
      console.error('Error saving list:', error);
    }
  };

  const agregarProducto = async () => {
    if (!nuevoProducto.trim() || !lista) return;

    const producto: ProductoLista = {
      id: Date.now().toString(),
      nombre: nuevoProducto,
      cantidad: parseInt(cantidad) || 1,
      precio: precio ? parseFloat(precio) : undefined,
      comprado: false,
      categoria
    };

    const listaActualizada = {
      ...lista,
      productos: [...lista.productos, producto],
      total: lista.total + (producto.precio ? producto.precio * producto.cantidad : 0)
    };

    await saveLista(listaActualizada);
    resetForm();
    setShowModal(false);
  };

  const editarProducto = async () => {
    if (!editingProduct || !nuevoProducto.trim() || !lista) return;

    const productosActualizados = lista.productos.map(p =>
      p.id === editingProduct.id 
        ? {
            ...p,
            nombre: nuevoProducto,
            cantidad: parseInt(cantidad) || 1,
            precio: precio ? parseFloat(precio) : undefined,
            categoria
          }
        : p
    );

    const nuevoTotal = productosActualizados.reduce((sum, p) => 
      sum + (p.precio ? p.precio * p.cantidad : 0), 0
    );

    const listaActualizada = {
      ...lista,
      productos: productosActualizados,
      total: nuevoTotal
    };

    await saveLista(listaActualizada);
    resetForm();
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const resetForm = () => {
    setNuevoProducto('');
    setCantidad('1');
    setPrecio('');
    setCategoria('Otros');
    setSelectedSupermarket('');
  };

  const openEditModal = (producto: ProductoLista) => {
    setEditingProduct(producto);
    setNuevoProducto(producto.nombre);
    setCantidad(producto.cantidad.toString());
    setPrecio(producto.precio ? producto.precio.toString() : '');
    setCategoria(producto.categoria);
    setShowEditModal(true);
  };

  const toggleProducto = async (productoId: string) => {
    if (!lista) return;

    const productosActualizados = lista.productos.map(p =>
      p.id === productoId ? { ...p, comprado: !p.comprado } : p
    );

    const listaActualizada = {
      ...lista,
      productos: productosActualizados,
      completada: productosActualizados.every(p => p.comprado) && productosActualizados.length > 0
    };

    await saveLista(listaActualizada);
  };

  const eliminarProducto = async (productoId: string) => {
    if (!lista) return;

    Alert.alert(
      'Eliminar Producto',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const productosActualizados = lista.productos.filter(p => p.id !== productoId);
            const nuevoTotal = productosActualizados.reduce((sum, p) => 
              sum + (p.precio ? p.precio * p.cantidad : 0), 0
            );
            
            const listaActualizada = {
              ...lista,
              productos: productosActualizados,
              total: nuevoTotal,
              completada: productosActualizados.every(p => p.comprado) && productosActualizados.length > 0
            };
            await saveLista(listaActualizada);
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-50">
        <Text className="text-purple-600 text-lg">Cargando lista...</Text>
      </View>
    );
  }

  if (!lista) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-50 px-6">
        <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
          <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
        </View>
        <Text className="text-xl font-semibold text-gray-900 mb-2">Lista no encontrada</Text>
        <Text className="text-gray-600 text-center mb-6">
          La lista que buscas no existe o fue eliminada
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-purple-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Volver</Text>
        </Pressable>
      </View>
    );
  }

  const productosComprados = lista.productos.filter(p => p.comprado).length;
  const totalProductos = lista.productos.length;
  const progreso = totalProductos > 0 ? (productosComprados / totalProductos) * 100 : 0;

  return (
    <View className="flex-1 bg-purple-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          <View className="flex-row items-center mb-6">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mr-4"
            >
              <Ionicons name="arrow-back" size={20} color="#8B5CF6" />
            </Pressable>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">{lista.nombre}</Text>
              <Text className="text-gray-600">Creada el {lista.fecha}</Text>
            </View>
            <Pressable
              onPress={() => setShowModal(true)}
              className="bg-purple-500 w-12 h-12 rounded-full items-center justify-center shadow-lg"
            >
              <Ionicons name="add" size={24} color="white" />
            </Pressable>
          </View>

          <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-900">📊 Progreso</Text>
              {lista.completada && (
                <View className="bg-purple-100 px-3 py-1 rounded-full">
                  <Text className="text-purple-700 text-xs font-semibold">COMPLETADA</Text>
                </View>
              )}
            </View>
            
            <View className="bg-gray-200 h-3 rounded-full overflow-hidden mb-3">
              <View
                className="bg-purple-500 h-full"
                style={{ width: `${progreso}%` }}
              />
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">
                {productosComprados} de {totalProductos} productos comprados
              </Text>
              <Text className="text-purple-600 font-semibold">
                {progreso.toFixed(0)}%
              </Text>
            </View>

            {lista.total > 0 && (
              <View className="mt-3 p-3 bg-purple-50 rounded-lg">
                <Text className="text-purple-700 font-medium text-center">
                  💰 Total estimado: ${lista.total.toFixed(2)}
                </Text>
              </View>
            )}
          </View>

            <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <View className="p-5 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">
                🛒 Productos ({totalProductos})
              </Text>
            </View>

            {lista.productos.length === 0 ? (
              <View className="p-8 items-center">
                <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-4">
                  <Ionicons name="list-outline" size={32} color="#8B5CF6" />
                </View>
                <Text className="text-gray-900 font-semibold text-lg mb-2">Lista vacía</Text>
                <Text className="text-gray-600 text-center mb-4">
                  Agrega productos a tu lista de compras
                </Text>
                <Pressable
                  onPress={() => setShowModal(true)}
                  className="bg-purple-500 px-6 py-3 rounded-xl"
                >
                  <Text className="text-white font-semibold">Agregar Producto</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                {lista.productos.map((producto, index) => (
                  <View key={producto.id}>
                    <View className={`p-4 ${producto.comprado ? 'bg-purple-50' : 'bg-white'}`}>
                      <View className="flex-row items-center">
                        <Pressable
                          onPress={() => toggleProducto(producto.id)}
                          className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${
                            producto.comprado 
                              ? 'bg-purple-500 border-purple-500' 
                              : 'border-gray-300'
                          }`}
                        >
                          {producto.comprado && (
                            <Ionicons name="checkmark" size={16} color="white" />
                          )}
                        </Pressable>

                        <View className="flex-1">
                          <Text className={`font-semibold ${
                            producto.comprado 
                              ? 'text-purple-700 line-through' 
                              : 'text-gray-900'
                          }`}>
                            {producto.nombre}
                          </Text>
                          <View className="flex-row items-center mt-1 flex-wrap">
                            <Text className="text-gray-500 text-sm">
                              Cantidad: {producto.cantidad}
                            </Text>
                            <Text className="text-gray-400 text-sm mx-2">•</Text>
                            <Text className="text-gray-500 text-sm">
                              {producto.categoria}
                            </Text>
                            {producto.precio && (
                              <>
                                <Text className="text-gray-400 text-sm mx-2">•</Text>
                                <Text className="text-purple-600 text-sm font-medium">
                                  ${(producto.precio * producto.cantidad).toFixed(2)}
                                </Text>
                              </>
                            )}
                          </View>
                        </View>

                        <View className="flex-row items-center">
                          <Pressable
                            onPress={() => openEditModal(producto)}
                            className="p-2 mr-1"
                          >
                            <Ionicons name="pencil-outline" size={18} color="#8B5CF6" />
                          </Pressable>
                          <Pressable
                            onPress={() => eliminarProducto(producto.id)}
                            className="p-2"
                          >
                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                          </Pressable>
                        </View>
                      </View>
                    </View>
                    {index < lista.productos.length - 1 && (
                      <View className="border-b border-gray-100 ml-12" />
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showModal && !showCategorias}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-6">
          <View className="bg-white rounded-xl p-6 w-full max-w-md">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-900">➕ Agregar Producto</Text>
              <Pressable onPress={() => {
                setShowModal(false);
                resetForm();
              }}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Nombre del producto *
                </Text>
                <TextInput
                  value={nuevoProducto}
                  onChangeText={setNuevoProducto}
                  placeholder="¿Qué producto necesitas?"
                  className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 text-base"
                  autoFocus
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-gray-700 font-semibold mb-2">Cantidad</Text>
                  <TextInput
                    value={cantidad}
                    onChangeText={setCantidad}
                    placeholder="1"
                    keyboardType="numeric"
                    className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 text-base"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-700 font-semibold mb-2">Precio (opcional)</Text>
                  <TextInput
                    value={precio}
                    onChangeText={setPrecio}
                    placeholder="$0.00"
                    keyboardType="numeric"
                    className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 text-base"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-2">Categoría</Text>
                <Pressable 
                  className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 flex-row justify-between items-center"
                  onPress={() => setShowCategorias(true)}
                >
                  <Text className={categoria ? "text-gray-700" : "text-gray-400"}>
                    {categoria || "Selecciona una categoría"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                </Pressable>
              </View>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 py-4 rounded-xl"
                >
                  <Text className="text-gray-700 text-center font-semibold">Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={agregarProducto}
                  className="flex-1 bg-purple-500 py-4 rounded-xl"
                  disabled={!nuevoProducto.trim()}
                >
                  <Text className="text-white text-center font-semibold">Agregar</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCategorias}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCategorias(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white rounded-xl p-6 w-11/12 max-w-md max-h-3/4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bold text-xl text-gray-800">
                🏷️ Seleccionar Categoría
              </Text>
              <Pressable onPress={() => setShowCategorias(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-2">
                {categorias.map((cat) => (
                  <Pressable
                    key={cat}
                    className={`flex-row items-center justify-between p-4 rounded-lg ${
                      categoria === cat ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50'
                    }`}
                    onPress={() => {
                      setCategoria(cat);
                      setShowCategorias(false);
                    }}
                  >
                    <Text className={`font-medium ${
                      categoria === cat ? 'text-purple-700' : 'text-gray-700'
                    }`}>
                      {cat}
                    </Text>
                    {categoria === cat ? (
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
      </Modal>

      <Modal
        visible={showEditModal && !showCategorias}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-6">
          <View className="bg-white rounded-xl p-6 w-full max-w-md">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-900">✏️ Editar Producto</Text>
              <Pressable onPress={() => {
                setShowEditModal(false);
                setEditingProduct(null);
                resetForm();
              }}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Nombre del producto *
                </Text>
                <TextInput
                  value={nuevoProducto}
                  onChangeText={setNuevoProducto}
                  placeholder="¿Qué producto necesitas?"
                  className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 text-base"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-gray-700 font-semibold mb-2">Cantidad</Text>
                  <TextInput
                    value={cantidad}
                    onChangeText={setCantidad}
                    placeholder="1"
                    keyboardType="numeric"
                    className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 text-base"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-700 font-semibold mb-2">Precio (opcional)</Text>
                  <TextInput
                    value={precio}
                    onChangeText={setPrecio}
                    placeholder="$0.00"
                    keyboardType="numeric"
                    className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 text-base"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-2">Categoría</Text>
                <Pressable 
                  className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 flex-row justify-between items-center"
                  onPress={() => setShowCategorias(true)}
                >
                  <Text className={categoria ? "text-gray-700" : "text-gray-400"}>
                    {categoria || "Selecciona una categoría"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                </Pressable>
              </View>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 py-4 rounded-xl"
                >
                  <Text className="text-gray-700 text-center font-semibold">Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={editarProducto}
                  className="flex-1 bg-purple-500 py-4 rounded-xl"
                  disabled={!nuevoProducto.trim()}
                >
                  <Text className="text-white text-center font-semibold">Guardar</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>


    </View>
  );
} 