import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

interface LoginRequiredProps {
  feature: string;
}

const LoginRequired = ({ feature }: LoginRequiredProps) => {
  const router = useRouter();

  const goToProfile = () => {
    router.navigate("/(tabs)/profile");
  };

  return (
    <View className="flex-1 bg-purple-50 justify-center items-center px-6 py-10">
      <View className="bg-white w-full rounded-xl p-6 shadow-sm items-center">
        <View className="w-20 h-20 rounded-full bg-purple-100 items-center justify-center mb-4">
          <Ionicons name="lock-closed-outline" size={40} color="#8B5CF6" />
        </View>
        
        <Text className="text-2xl font-bold text-purple-800 mb-3 text-center">
          Contenido bloqueado
        </Text>
        
        <Text className="text-gray-600 mb-6 text-center">
          Necesitas iniciar sesión o registrarte para acceder a {feature}.
        </Text>
        
        <Pressable
          onPress={goToProfile}
          className="bg-purple-600 py-3 px-6 rounded-xl w-full"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Iniciar sesión
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginRequired; 