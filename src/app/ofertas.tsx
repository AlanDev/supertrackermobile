import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { LoginRequired } from './components/LoginRequired';

interface Oferta {
  id: string;
  titulo: string;
  descripcion: string;
  descuento: number;
  comercio: string;
  categoria: string;
  fechaVencimiento: string;
  imagen: string;
  condiciones: string;
  activa: boolean;
  limiteCantidad?: number;
  tipo: 'porcentaje' | 'precio_fijo' | '2x1' | 'promo_especial';
}

export default function OfertasScreen() {
  const { isLoggedIn } = useAuth();
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [refreshing, setRefreshing] = useState(false);

  const categorias = ['todas', 'Lácteos', 'Carnes', 'Bebidas', 'Limpieza', 'Higiene', 'Panadería'];

  useEffect(() => {
    loadOfertas();
  }, []);

  const loadOfertas = () => {
    const ofertasData: Oferta[] = [
      {
        id: '1',
        titulo: 'Leche La Serenísima',
        descripcion: '25% OFF en toda la línea de lácteos',
        descuento: 25,
        comercio: 'Carrefour Express',
        categoria: 'Lácteos',
        fechaVencimiento: '2025-01-31',
        imagen: 'https://via.placeholder.com/150x100/4F46E5/FFFFFF?text=Leche',
        condiciones: 'Válido hasta agotar stock. Máximo 3 unidades por cliente.',
        activa: true,
        limiteCantidad: 3,
        tipo: 'porcentaje'
      },
      {
        id: '2',
        titulo: 'Coca Cola 2x1',
        descripcion: 'Llevá 2 Coca Cola y pagá 1',
        descuento: 50,
        comercio: 'Dia Market',
        categoria: 'Bebidas',
        fechaVencimiento: '2025-01-25',
        imagen: 'https://via.placeholder.com/150x100/DC2626/FFFFFF?text=Coca',
        condiciones: 'Solo productos de 2L. No válido con otras promociones.',
        activa: true,
        tipo: '2x1'
      },
      {
        id: '3',
        titulo: 'Pan Artesanal $800',
        descripcion: 'Pan casero recién horneado a precio especial',
        descuento: 30,
        comercio: 'Panadería Don José',
        categoria: 'Panadería',
        fechaVencimiento: '2025-01-28',
        imagen: 'https://via.placeholder.com/150x100/F59E0B/FFFFFF?text=Pan',
        condiciones: 'Válido de martes a viernes. Precio normal $1200.',
        activa: true,
        tipo: 'precio_fijo'
      },
      {
        id: '4',
        titulo: 'Detergente Skip',
        descripcion: '40% OFF en productos de limpieza',
        descuento: 40,
        comercio: 'Jumbo Express',
        categoria: 'Limpieza',
        fechaVencimiento: '2025-01-30',
        imagen: 'https://via.placeholder.com/150x100/10B981/FFFFFF?text=Skip',
        condiciones: 'Mínima compra $5000. Válido solo los miércoles.',
        activa: true,
        tipo: 'porcentaje'
      },
      {
        id: '5',
        titulo: 'Shampoo Sedal',
        descripcion: 'Oferta especial en cuidado personal',
        descuento: 20,
        comercio: 'Farmacia Central',
        categoria: 'Higiene',
        fechaVencimiento: '2025-01-20',
        imagen: 'https://via.placeholder.com/150x100/8B5CF6/FFFFFF?text=Sedal',
        condiciones: 'Hasta agotar stock.',
        activa: false,
        tipo: 'porcentaje'
      }
    ];
    setOfertas(ofertasData);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadOfertas();
    setRefreshing(false);
  };

  const ofertasFiltradas = ofertas.filter(oferta => {
    if (filtroCategoria === 'todas') return true;
    return oferta.categoria === filtroCategoria;
  });

  const ofertasActivas = ofertasFiltradas.filter(oferta => oferta.activa);

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'porcentaje': return 'percent';
      case '2x1': return 'copy-outline';
      case 'precio_fijo': return 'pricetag-outline';
      default: return 'gift-outline';
    }
  };

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'porcentaje': return '#EF4444';
      case '2x1': return '#10B981';
      case 'precio_fijo': return '#F59E0B';
      default: return '#8B5CF6';
    }
  };

  if (!isLoggedIn) {
    return <LoginRequired feature="las ofertas especiales" />;
  }

  return (
    <View className="flex-1 bg-purple-50">
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-6 py-8">

          <View className="mb-8">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mb-4"
            >
              <Ionicons name="arrow-back" size={20} color="#EC4899" />
            </Pressable>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              🎁 Ofertas y Descuentos
            </Text>
            <Text className="text-gray-600">
              Aprovecha las mejores promociones disponibles
            </Text>
          </View>


          <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-red-600">{ofertasActivas.length}</Text>
                <Text className="text-sm text-gray-600">Ofertas Activas</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">
                  {ofertasActivas.length > 0 ? Math.max(...ofertasActivas.map(o => o.descuento)) : 0}%
                </Text>
                <Text className="text-sm text-gray-600">Máximo Descuento</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-600">
                  {new Set(ofertasActivas.map(o => o.comercio)).size}
                </Text>
                <Text className="text-sm text-gray-600">Comercios</Text>
              </View>
            </View>
          </View>


          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            <View className="flex-row space-x-3">
              {categorias.map((categoria) => (
                <Pressable
                  key={categoria}
                  onPress={() => setFiltroCategoria(categoria)}
                  className={`px-4 py-2 rounded-full ${
                    filtroCategoria === categoria 
                      ? 'bg-pink-500' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <Text className={`font-medium capitalize ${
                    filtroCategoria === categoria ? 'text-white' : 'text-gray-700'
                  }`}>
                    {categoria}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {ofertasFiltradas.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 items-center">
              <View className="w-20 h-20 bg-pink-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="gift-outline" size={40} color="#EC4899" />
              </View>
              <Text className="text-xl font-semibold text-gray-900 mb-2">
                No hay ofertas disponibles
              </Text>
              <Text className="text-gray-600 text-center">
                Cambia el filtro de categoría para ver más ofertas
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              {ofertasFiltradas.map((oferta) => (
                <View 
                  key={oferta.id} 
                  className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                    oferta.activa ? 'border-gray-100' : 'border-gray-200 opacity-60'
                  }`}
                >
                  <View className="absolute top-4 right-4 z-10">
                    {oferta.activa ? (
                      <View className="bg-green-500 px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-semibold">ACTIVA</Text>
                      </View>
                    ) : (
                      <View className="bg-gray-400 px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-semibold">EXPIRADA</Text>
                      </View>
                    )}
                  </View>

                  <View className="relative">
                    <View className="h-32 bg-gray-200 justify-center items-center">
                      <Text className="text-gray-500">Imagen del producto</Text>
                    </View>
                    <View 
                      className="absolute bottom-3 left-3 w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: getColorTipo(oferta.tipo) }}
                    >
                      <Ionicons 
                        name={getIconoTipo(oferta.tipo) as any} 
                        size={20} 
                        color="white" 
                      />
                    </View>
                  </View>

                  <View className="p-5">
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-900 mb-1">
                          {oferta.titulo}
                        </Text>
                        <Text className="text-gray-600 mb-2">
                          {oferta.descripcion}
                        </Text>
                      </View>
                      <View className="bg-red-100 px-3 py-1 rounded-full ml-3">
                        <Text className="text-red-600 font-bold">
                          -{oferta.descuento}%
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center mb-3">
                      <Ionicons name="storefront-outline" size={16} color="#6B7280" />
                      <Text className="text-gray-600 text-sm ml-2">{oferta.comercio}</Text>
                      <Text className="text-gray-400 text-sm mx-2">•</Text>
                      <Text className="text-gray-600 text-sm">{oferta.categoria}</Text>
                    </View>

                    <View className="flex-row items-center mb-3">
                      <Ionicons name="time-outline" size={16} color="#6B7280" />
                      <Text className="text-gray-600 text-sm ml-2">
                        Válido hasta: {new Date(oferta.fechaVencimiento).toLocaleDateString()}
                      </Text>
                    </View>

                    <View className="bg-gray-50 p-3 rounded-lg mb-4">
                      <Text className="text-xs text-gray-600">
                        <Text className="font-semibold">Condiciones: </Text>
                        {oferta.condiciones}
                      </Text>
                    </View>

                    <Pressable 
                      className={`py-3 rounded-xl ${
                        oferta.activa 
                          ? 'bg-pink-500' 
                          : 'bg-gray-300'
                      }`}
                      disabled={!oferta.activa}
                    >
                      <Text className={`text-center font-semibold ${
                        oferta.activa ? 'text-white' : 'text-gray-500'
                      }`}>
                        {oferta.activa ? 'Ver en Comercio' : 'Oferta Expirada'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
} 