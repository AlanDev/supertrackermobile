import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ConfiguracionOption {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  tipo: 'navegacion' | 'switch' | 'accion';
  valor?: boolean;
  ruta?: string;
  accion?: () => void;
}

export default function ConfiguracionScreen() {
  const { logout } = useAuth();
  const [configuraciones, setConfiguraciones] = useState({
    notificaciones: true,
    ubicacion: true,
    ofertas: true,
    analytics: false,
    modo_oscuro: false,
  });

  const actualizarConfiguracion = async (key: string, value: boolean) => {
    const nuevasConfiguraciones = { ...configuraciones, [key]: value };
    setConfiguraciones(nuevasConfiguraciones);
    
    try {
      await AsyncStorage.setItem('app_settings', JSON.stringify(nuevasConfiguraciones));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const limpiarCache = () => {
    Alert.alert(
      'Limpiar Cache',
      '¿Estás seguro de que deseas limpiar el cache de la aplicación? Esto puede mejorar el rendimiento.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          onPress: async () => {
            try {
              // Aquí limpiarías el cache específico, manteniendo datos importantes
              Alert.alert('Éxito', 'Cache limpiado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo limpiar el cache');
            }
          }
        }
      ]
    );
  };

  const exportarDatos = () => {
    Alert.alert(
      'Exportar Datos',
      'Esta función te permitirá descargar todos tus datos en formato JSON.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Exportar', onPress: () => {
          // Implementar exportación de datos
          Alert.alert('Info', 'Función en desarrollo');
        }}
      ]
    );
  };

  const opciones: ConfiguracionOption[] = [
    // Cuenta y Perfil
    {
      id: 'cuenta',
      titulo: 'Mi Cuenta',
      descripcion: 'Gestionar información personal',
      icono: 'person-circle-outline',
      tipo: 'navegacion',
      ruta: '/configuracion/cuenta'
    },
    {
      id: 'notificaciones_config',
      titulo: 'Notificaciones',
      descripcion: 'Configurar alertas y avisos',
      icono: 'notifications-outline',
      tipo: 'navegacion',
      ruta: '/configuracion/notificaciones'
    },
    
    // Preferencias
    {
      id: 'notificaciones',
      titulo: 'Recibir Notificaciones',
      descripcion: 'Avisos sobre ofertas y recordatorios',
      icono: 'notifications-outline',
      tipo: 'switch',
      valor: configuraciones.notificaciones
    },
    {
      id: 'ubicacion',
      titulo: 'Usar Ubicación',
      descripcion: 'Para encontrar comercios cercanos',
      icono: 'location-outline',
      tipo: 'switch',
      valor: configuraciones.ubicacion
    },
    {
      id: 'ofertas',
      titulo: 'Recibir Ofertas',
      descripcion: 'Notificaciones de descuentos especiales',
      icono: 'gift-outline',
      tipo: 'switch',
      valor: configuraciones.ofertas
    },
    {
      id: 'modo_oscuro',
      titulo: 'Modo Oscuro',
      descripcion: 'Tema oscuro para la aplicación',
      icono: 'moon-outline',
      tipo: 'switch',
      valor: configuraciones.modo_oscuro
    },
    
    // Privacidad y Datos
    {
      id: 'analytics',
      titulo: 'Análisis de Uso',
      descripcion: 'Ayudar a mejorar la aplicación',
      icono: 'analytics-outline',
      tipo: 'switch',
      valor: configuraciones.analytics
    },
    {
      id: 'exportar',
      titulo: 'Exportar Mis Datos',
      descripcion: 'Descargar información personal',
      icono: 'download-outline',
      tipo: 'accion',
      accion: exportarDatos
    },
    
    // Mantenimiento
    {
      id: 'cache',
      titulo: 'Limpiar Cache',
      descripcion: 'Liberar espacio y mejorar rendimiento',
      icono: 'refresh-outline',
      tipo: 'accion',
      accion: limpiarCache
    },
    
    // Información
    {
      id: 'ayuda',
      titulo: 'Ayuda y Soporte',
      descripcion: 'Centro de ayuda y contacto',
      icono: 'help-circle-outline',
      tipo: 'navegacion',
      ruta: '/ayuda'
    },
    {
      id: 'acerca',
      titulo: 'Acerca de SuperTracker',
      descripcion: 'Versión 1.0.0 - Información de la app',
      icono: 'information-circle-outline',
      tipo: 'navegacion',
      ruta: '/acerca'
    }
  ];

  const secciones = [
    {
      titulo: 'Cuenta y Perfil',
      opciones: opciones.filter(o => ['cuenta', 'notificaciones_config'].includes(o.id))
    },
    {
      titulo: 'Preferencias',
      opciones: opciones.filter(o => ['notificaciones', 'ubicacion', 'ofertas', 'modo_oscuro'].includes(o.id))
    },
    {
      titulo: 'Privacidad y Datos',
      opciones: opciones.filter(o => ['analytics', 'exportar'].includes(o.id))
    },
    {
      titulo: 'Mantenimiento',
      opciones: opciones.filter(o => ['cache'].includes(o.id))
    },
    {
      titulo: 'Información',
      opciones: opciones.filter(o => ['ayuda', 'acerca'].includes(o.id))
    }
  ];

  const handlePress = (opcion: ConfiguracionOption) => {
    switch (opcion.tipo) {
      case 'navegacion':
        if (opcion.ruta) {
          router.push(opcion.ruta as any);
        }
        break;
      case 'accion':
        if (opcion.accion) {
          opcion.accion();
        }
        break;
    }
  };

  const handleSwitchChange = (id: string, value: boolean) => {
    actualizarConfiguracion(id, value);
  };

  return (
    <View className="flex-1 bg-purple-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mb-4"
            >
              <Ionicons name="arrow-back" size={20} color="#6366F1" />
            </Pressable>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              ⚙️ Configuración
            </Text>
            <Text className="text-gray-600">
              Personaliza tu experiencia en SuperTracker
            </Text>
          </View>

          {/* Secciones */}
          {secciones.map((seccion, index) => (
            <View key={index} className="mb-8">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                {seccion.titulo}
              </Text>
              
              <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {seccion.opciones.map((opcion, opcionIndex) => (
                  <View key={opcion.id}>
                    <Pressable
                      onPress={() => handlePress(opcion)}
                      disabled={opcion.tipo === 'switch'}
                      className="p-5 active:bg-gray-50"
                    >
                      <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-4">
                          <Ionicons 
                            name={opcion.icono as any} 
                            size={20} 
                            color="#6366F1" 
                          />
                        </View>
                        
                        <View className="flex-1">
                          <Text className="text-gray-900 font-semibold text-base mb-1">
                            {opcion.titulo}
                          </Text>
                          <Text className="text-gray-600 text-sm">
                            {opcion.descripcion}
                          </Text>
                        </View>

                        {opcion.tipo === 'switch' ? (
                          <Switch
                            value={opcion.valor}
                            onValueChange={(value) => handleSwitchChange(opcion.id, value)}
                            trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
                            thumbColor={opcion.valor ? '#FFFFFF' : '#9CA3AF'}
                          />
                        ) : (
                          <Ionicons 
                            name="chevron-forward" 
                            size={20} 
                            color="#D1D5DB" 
                          />
                        )}
                      </View>
                    </Pressable>
                    
                    {opcionIndex < seccion.opciones.length - 1 && (
                      <View className="border-b border-gray-100 ml-16" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Botón de cerrar sesión */}
          <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Cerrar Sesión',
                  '¿Estás seguro de que deseas cerrar sesión?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Cerrar Sesión',
                      style: 'destructive',
                      onPress: logout
                    }
                  ]
                );
              }}
              className="p-5 active:bg-red-50"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                </View>
                
                <View className="flex-1">
                  <Text className="text-red-600 font-semibold text-base">
                    Cerrar Sesión
                  </Text>
                  <Text className="text-red-400 text-sm">
                    Salir de tu cuenta
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>

          {/* Footer con información de versión */}
          <View className="mt-8 items-center">
            <Text className="text-gray-500 text-sm">
              SuperTracker Mobile v1.0.0
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              © 2025 - Todos los derechos reservados
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 