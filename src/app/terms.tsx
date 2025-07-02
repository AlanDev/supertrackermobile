import React from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTerms } from './context/TermsContext';

export default function TermsScreen() {
  const { acceptTerms } = useTerms();

  const handleAcceptTerms = async () => {
    try {
      await acceptTerms();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error accepting terms:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
      
      <View style={{ backgroundColor: '#8B5CF6' }} className="pt-12 pb-6 px-6">
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center mr-4">
            <Ionicons name="document-text" size={18} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold">Términos y Condiciones</Text>
        </View>
        <Text className="text-white/90 text-sm mt-2 font-medium">
          Última actualización: Enero 2025
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="bg-purple-50 rounded-xl p-6 mb-6 border border-purple-100">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
              <Ionicons name="shield-checkmark" size={24} color="#8B5CF6" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900">Bienvenido a SuperTracker</Text>
              <Text className="text-gray-600 text-sm">Tu comparador de precios de confianza</Text>
            </View>
          </View>
          <Text className="text-gray-700 leading-6">
            Al usar SuperTracker, aceptas estos términos que protegen tanto tus derechos como los nuestros. 
            Lee cuidadosamente antes de continuar.
          </Text>
        </View>

        <View className="space-y-6">
          <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-purple-100 rounded-lg items-center justify-center mr-3">
                <Ionicons name="phone-portrait" size={16} color="#8B5CF6" />
              </View>
              <Text className="text-lg font-bold text-gray-900">1. Uso del Servicio</Text>
            </View>
            <Text className="text-gray-700 leading-6 mb-3">
              SuperTracker es una aplicación gratuita que te permite comparar precios de productos en diferentes comercios. 
              Nos comprometemos a proporcionarte información precisa y actualizada.
            </Text>
            <Text className="text-gray-700 leading-6">
              • Puedes usar la app para fines personales y comerciales{'\n'}
              • Los precios mostrados son referenciales{'\n'}
              • Verificamos la información regularmente
            </Text>
          </View>

          <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-purple-100 rounded-lg items-center justify-center mr-3">
                <Ionicons name="lock-closed" size={16} color="#8B5CF6" />
              </View>
              <Text className="text-lg font-bold text-gray-900">2. Privacidad y Datos</Text>
            </View>
            <Text className="text-gray-700 leading-6 mb-3">
              Tu privacidad es fundamental para nosotros. Solo recopilamos datos necesarios para mejorar tu experiencia.
            </Text>
            <Text className="text-gray-700 leading-6">
              • No compartimos datos personales con terceros{'\n'}
              • Uso de ubicación solo para sugerencias locales{'\n'}
              • Puedes eliminar tu cuenta en cualquier momento
            </Text>
          </View>

          <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-purple-100 rounded-lg items-center justify-center mr-3">
                <Ionicons name="people" size={16} color="#8B5CF6" />
              </View>
              <Text className="text-lg font-bold text-gray-900">3. Responsabilidades</Text>
            </View>
            <Text className="text-gray-700 leading-6">
              • SuperTracker actúa como intermediario informativo{'\n'}
              • Los comercios son responsables de sus precios y stock{'\n'}
              • Recomendamos verificar información antes de comprar{'\n'}
              • No nos hacemos responsables por transacciones entre usuarios y comercios
            </Text>
          </View>

          <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-purple-100 rounded-lg items-center justify-center mr-3">
                <Ionicons name="refresh" size={16} color="#8B5CF6" />
              </View>
              <Text className="text-lg font-bold text-gray-900">4. Actualizaciones</Text>
            </View>
            <Text className="text-gray-700 leading-6">
              Podemos actualizar estos términos ocasionalmente. Te notificaremos sobre cambios importantes 
              a través de la aplicación o por email.
            </Text>
          </View>

          <View className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-xl p-5 border border-purple-200">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-purple-200 rounded-lg items-center justify-center mr-3">
                <Ionicons name="mail" size={16} color="#8B5CF6" />
              </View>
              <Text className="text-lg font-bold text-purple-900">¿Preguntas?</Text>
            </View>
            <Text className="text-purple-800 leading-6">
              Si tienes dudas sobre estos términos, contáctanos en:{'\n'}
              📧 soporte@supertracker.arg{'\n'}
              📱 WhatsApp: +54 3624 000000
            </Text>
          </View>
        </View>

        <View className="h-24" />
      </ScrollView>

      <View className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <Pressable
          onPress={handleAcceptTerms}
          style={{ backgroundColor: '#8B5CF6' }}
          className="py-4 rounded-xl shadow-lg active:opacity-80"
        >
          <Text className="text-white text-center font-bold text-lg">
            ACEPTAR Y CONTINUAR
          </Text>
        </Pressable>
        
        <Text className="text-center text-gray-500 text-xs mt-3 leading-4">
          Al tocar "Aceptar y Continuar", confirmas que has leído y aceptas{'\n'}
          nuestros Términos y Condiciones y Política de Privacidad
        </Text>
      </View>
    </View>
  );
} 