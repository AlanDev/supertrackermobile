import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  priceAlerts: boolean;
  stockAlerts: boolean;
  promotionAlerts: boolean;
  weeklyDigest: boolean;
  newFeatures: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: boolean;
}

export default function NotificacionesScreen() {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: true,
    emailEnabled: true,
    priceAlerts: true,
    stockAlerts: false,
    promotionAlerts: true,
    weeklyDigest: true,
    newFeatures: true,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('notification_settings');
      if (savedSettings) {
        setSettings({ ...settings, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem('notification_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const NotificationItem = ({ 
    title, 
    subtitle, 
    value, 
    onToggle, 
    icon, 
    color = '#8B5CF6' 
  }: {
    title: string;
    subtitle: string;
    value: boolean;
    onToggle: () => void;
    icon: string;
    color?: string;
  }) => (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: color + '20' }}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <View className="flex-1">
          <Text className="text-gray-900 font-semibold text-base">{title}</Text>
          <Text className="text-gray-600 text-sm mt-1">{subtitle}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E7EB', true: color + '40' }}
          thumbColor={value ? color : '#F3F4F6'}
        />
      </View>
    </View>
  );

  const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
    <View className="flex-row items-center mb-4 mt-6">
      <View className="w-8 h-8 bg-purple-100 rounded-lg items-center justify-center mr-3">
        <Ionicons name={icon as any} size={16} color="#8B5CF6" />
      </View>
      <Text className="text-lg font-bold text-gray-900">{title}</Text>
    </View>
  );

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
              <Text className="text-2xl font-bold text-gray-900">Notificaciones</Text>
              <Text className="text-gray-600">Configura tus preferencias</Text>
            </View>
          </View>

          <SectionHeader title="General" icon="notifications-outline" />
          
          <NotificationItem
            title="Notificaciones Push"
            subtitle="Recibir notificaciones en tu dispositivo"
            value={settings.pushEnabled}
            onToggle={() => toggleSetting('pushEnabled')}
            icon="phone-portrait-outline"
            color="#8B5CF6"
          />

          <NotificationItem
            title="Notificaciones por Email"
            subtitle="Recibir notificaciones en tu correo electrónico"
            value={settings.emailEnabled}
            onToggle={() => toggleSetting('emailEnabled')}
            icon="mail-outline"
            color="#3B82F6"
          />

          <SectionHeader title="Alertas de Productos" icon="pricetag-outline" />

          <NotificationItem
            title="Alertas de Precios"
            subtitle="Notificar cuando cambie el precio de productos favoritos"
            value={settings.priceAlerts}
            onToggle={() => toggleSetting('priceAlerts')}
            icon="trending-down-outline"
            color="#F59E0B"
          />

          <NotificationItem
            title="Alertas de Stock"
            subtitle="Avisar cuando productos estén disponibles"
            value={settings.stockAlerts}
            onToggle={() => toggleSetting('stockAlerts')}
            icon="cube-outline"
            color="#EF4444"
          />

          <NotificationItem
            title="Promociones y Ofertas"
            subtitle="Recibir notificaciones sobre descuentos especiales"
            value={settings.promotionAlerts}
            onToggle={() => toggleSetting('promotionAlerts')}
            icon="gift-outline"
            color="#10B981"
          />

          <SectionHeader title="Contenido" icon="newspaper-outline" />

          <NotificationItem
            title="Resumen Semanal"
            subtitle="Recibir un resumen de ofertas y estadísticas"
            value={settings.weeklyDigest}
            onToggle={() => toggleSetting('weeklyDigest')}
            icon="calendar-outline"
            color="#06B6D4"
          />

          <NotificationItem
            title="Nuevas Funcionalidades"
            subtitle="Entérate de las últimas funciones de la app"
            value={settings.newFeatures}
            onToggle={() => toggleSetting('newFeatures')}
            icon="sparkles-outline"
            color="#8B5CF6"
          />

          <SectionHeader title="Sonido y Vibración" icon="volume-medium-outline" />

          <NotificationItem
            title="Sonido"
            subtitle="Reproducir sonido con las notificaciones"
            value={settings.soundEnabled}
            onToggle={() => toggleSetting('soundEnabled')}
            icon="musical-notes-outline"
            color="#F59E0B"
          />

          <NotificationItem
            title="Vibración"
            subtitle="Vibrar al recibir notificaciones"
            value={settings.vibrationEnabled}
            onToggle={() => toggleSetting('vibrationEnabled')}
            icon="phone-vibrate-outline"
            color="#6366F1"
          />

          <NotificationItem
            title="Horario Silencioso"
            subtitle="Sin notificaciones de 22:00 a 08:00"
            value={settings.quietHours}
            onToggle={() => toggleSetting('quietHours')}
            icon="moon-outline"
            color="#374151"
          />

          <View className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-xl p-4 border border-purple-200 mt-6">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-purple-200 rounded-full items-center justify-center mr-3">
                <Ionicons name="information-circle" size={20} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="text-purple-900 font-semibold text-sm">
                  Configuración Inteligente
                </Text>
                <Text className="text-purple-700 text-xs mt-1">
                  Las notificaciones se adaptan a tu comportamiento de uso
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 