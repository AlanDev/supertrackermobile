import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { LoginRequired } from '../components/LoginRequired';

export default function AjustesScreen() {
  const { isLoggedIn } = useAuth();
  const [notificaciones, setNotificaciones] = useState(true);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [actualizacionesAutomaticas, setActualizacionesAutomaticas] = useState(true);
  const [compartirUbicacion, setCompartirUbicacion] = useState(true);
  const [analisisDatos, setAnalisisDatos] = useState(false);

  if (!isLoggedIn) {
    return <LoginRequired feature="la configuración de ajustes" />;
  }

  const handleClearCache = () => {
    Alert.alert(
      'Limpiar Caché',
      '¿Estás seguro de que deseas limpiar la caché de la aplicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          onPress: () => {
            Alert.alert('✅ Éxito', 'Caché limpiada correctamente');
          }
        }
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      'Restablecer Aplicación',
      '¿Estás seguro de que deseas restablecer todos los ajustes a sus valores predeterminados? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: () => {
            setNotificaciones(true);
            setModoOscuro(false);
            setActualizacionesAutomaticas(true);
            setCompartirUbicacion(true);
            setAnalisisDatos(false);
            Alert.alert('✅ Éxito', 'Aplicación restablecida correctamente');
          }
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, description, value, onValueChange, type = 'switch' }: {
    icon: string;
    title: string;
    description: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'button';
  }) => (
    <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
            <Ionicons name={icon as any} size={24} color="#8B5CF6" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold text-base">{title}</Text>
            <Text className="text-gray-600 text-sm mt-1">{description}</Text>
          </View>
        </View>
        {type === 'switch' && value !== undefined && onValueChange && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#E5E7EB', true: '#C084FC' }}
            thumbColor={value ? '#8B5CF6' : '#F3F4F6'}
          />
        )}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-purple-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          <View className="mb-8">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mb-4"
            >
              <Ionicons name="arrow-back" size={20} color="#8B5CF6" />
            </Pressable>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              ⚙️ Ajustes
            </Text>
            <Text className="text-gray-600">
              Configura la aplicación según tus preferencias
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">🔔 Notificaciones</Text>
            <SettingItem
              icon="notifications-outline"
              title="Notificaciones Push"
              description="Recibe alertas sobre ofertas y promociones"
              value={notificaciones}
              onValueChange={setNotificaciones}
            />
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">🎨 Apariencia</Text>
            <SettingItem
              icon="moon-outline"
              title="Modo Oscuro"
              description="Cambia la apariencia de la aplicación"
              value={modoOscuro}
              onValueChange={setModoOscuro}
            />
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">🔄 Actualizaciones</Text>
            <SettingItem
              icon="download-outline"
              title="Actualizaciones Automáticas"
              description="Descarga automáticamente las nuevas versiones"
              value={actualizacionesAutomaticas}
              onValueChange={setActualizacionesAutomaticas}
            />
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">🔒 Privacidad</Text>
            <SettingItem
              icon="location-outline"
              title="Compartir Ubicación"
              description="Permite encontrar comercios cercanos"
              value={compartirUbicacion}
              onValueChange={setCompartirUbicacion}
            />
            <SettingItem
              icon="analytics-outline"
              title="Análisis de Datos"
              description="Ayuda a mejorar la aplicación"
              value={analisisDatos}
              onValueChange={setAnalisisDatos}
            />
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">💾 Almacenamiento</Text>
            <Pressable onPress={handleClearCache}>
              <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                      <Ionicons name="trash-outline" size={24} color="#3B82F6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold text-base">Limpiar Caché</Text>
                      <Text className="text-gray-600 text-sm mt-1">Libera espacio eliminando archivos temporales</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                </View>
              </View>
            </Pressable>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">ℹ️ Información</Text>
            <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Versión</Text>
                  <Text className="text-gray-900 font-semibold">1.0.0</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Última actualización</Text>
                  <Text className="text-gray-900 font-semibold">25 Dic 2025</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Tamaño de la app</Text>
                  <Text className="text-gray-900 font-semibold">42.5 MB</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-800 mb-4">⚠️ Avanzado</Text>
            <Pressable onPress={handleResetApp}>
              <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mr-4">
                      <Ionicons name="refresh-outline" size={24} color="#EF4444" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-red-600 font-semibold text-base">Restablecer Aplicación</Text>
                      <Text className="text-red-400 text-sm mt-1">Vuelve a los ajustes predeterminados</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                </View>
              </View>
            </Pressable>
          </View>

          <View className="bg-gray-100 rounded-xl p-4 items-center">
            <Text className="text-gray-600 text-sm text-center">
              SuperTracker Mobile v1.0.0{'\n'}
              © 2025 Todos los derechos reservados
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 