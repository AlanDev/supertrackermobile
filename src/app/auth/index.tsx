import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function AuthIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al login inmediatamente
    router.replace('/auth/login');
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-purple-50">
      <ActivityIndicator color="#8B5CF6" size="large" />
    </View>
  );
} 