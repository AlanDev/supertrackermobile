import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function CuentaScreen() {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = async () => {
    try {
      const success = await updateProfile({ name, email });
      if (success) {
        setIsEditing(false);
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
      } else {
        Alert.alert('Error', 'No se pudo actualizar el perfil');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al actualizar el perfil');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth');
          }
        }
      ]
    );
  };

  const deleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      'Esta acción es irreversible. ¿Estás seguro de que deseas eliminar tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Función no disponible', 'Esta función estará disponible en una próxima actualización');
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-purple-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          <View className="flex-row items-center mb-8">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mr-4"
            >
              <Ionicons name="arrow-back" size={20} color="#8B5CF6" />
            </Pressable>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">Mi Cuenta</Text>
              <Text className="text-gray-600">Gestiona tu información personal</Text>
            </View>
          </View>

          <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-lg font-bold text-gray-900">Información Personal</Text>
              <Pressable
                onPress={() => setIsEditing(!isEditing)}
                className="bg-purple-100 px-4 py-2 rounded-lg"
              >
                <Text className="text-purple-600 font-semibold">
                  {isEditing ? 'Cancelar' : 'Editar'}
                </Text>
              </Pressable>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 font-medium mb-2">Nombre</Text>
                {isEditing ? (
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    className="bg-gray-100 rounded-xl px-4 py-3 text-base"
                    placeholder="Tu nombre completo"
                  />
                ) : (
                  <Text className="text-gray-900 text-base">{name || 'No especificado'}</Text>
                )}
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-2">Correo Electrónico</Text>
                {isEditing ? (
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    className="bg-gray-100 rounded-xl px-4 py-3 text-base"
                    placeholder="tu@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                ) : (
                  <Text className="text-gray-900 text-base">{email}</Text>
                )}
              </View>

              {isEditing && (
                <Pressable
                  onPress={handleSave}
                  className="bg-purple-600 py-3 rounded-xl mt-4"
                >
                  <Text className="text-white text-center font-semibold">
                    Guardar Cambios
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">Estadísticas</Text>
            
            <View className="flex-row justify-between">
              <View className="flex-1 items-center">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="list" size={24} color="#22C55E" />
                </View>
                <Text className="text-2xl font-bold text-gray-900">0</Text>
                <Text className="text-gray-600 text-sm">Listas</Text>
              </View>
              
              <View className="flex-1 items-center">
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="heart" size={24} color="#3B82F6" />
                </View>
                <Text className="text-2xl font-bold text-gray-900">0</Text>
                <Text className="text-gray-600 text-sm">Favoritos</Text>
              </View>
              
              <View className="flex-1 items-center">
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="time" size={24} color="#8B5CF6" />
                </View>
                <Text className="text-2xl font-bold text-gray-900">0</Text>
                <Text className="text-gray-600 text-sm">Días</Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <Text className="text-lg font-bold text-gray-900 p-6 pb-0">Opciones de Cuenta</Text>
            
            <Pressable className="flex-row items-center p-6 border-b border-gray-100">
              <View className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center mr-4">
                <Ionicons name="key" size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold">Cambiar Contraseña</Text>
                <Text className="text-gray-600 text-sm">Actualiza tu contraseña</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>

            <Pressable className="flex-row items-center p-6 border-b border-gray-100">
              <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-4">
                <Ionicons name="shield-checkmark" size={20} color="#22C55E" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold">Privacidad</Text>
                <Text className="text-gray-600 text-sm">Configuración de privacidad</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>

            <Pressable className="flex-row items-center p-6">
              <View className="w-10 h-10 bg-orange-100 rounded-xl items-center justify-center mr-4">
                <Ionicons name="download" size={20} color="#F59E0B" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold">Exportar Datos</Text>
                <Text className="text-gray-600 text-sm">Descarga tus datos</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>
          </View>

          <View className="space-y-3">
            <Pressable
              onPress={handleLogout}
              className="bg-orange-50 border border-orange-200 rounded-xl p-4"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="log-out-outline" size={20} color="#F59E0B" />
                <Text className="text-orange-600 font-semibold ml-2">
                  Cerrar Sesión
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={deleteAccount}
              className="bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                <Text className="text-red-600 font-semibold ml-2">
                  Eliminar Cuenta
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 