import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { Button } from '../../atoms';
import { COLORS, SIZES, STRINGS } from '../../constants';

interface LoginRequiredProps {
  feature: string;
}

export const LoginRequired: React.FC<LoginRequiredProps> = ({ feature }) => {
  const router = useRouter();

  const goToProfile = () => {
    router.navigate("/(tabs)/profile");
  };

  return (
    <View className="flex-1 bg-purple-50 justify-center items-center px-6">
      <View className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-xl border border-gray-100 items-center">
        {/* Ícono con gradiente */}
        <View className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full items-center justify-center mb-6 shadow-lg">
          <Ionicons 
            name="lock-closed-outline" 
            size={32} 
            color="white" 
          />
        </View>
        
        {/* Título principal */}
        <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
          Contenido Bloqueado
        </Text>
        
        {/* Subtítulo descriptivo */}
        <Text className="text-base text-gray-600 mb-8 text-center leading-6">
          Para acceder a {feature} necesitas iniciar sesión en tu cuenta
        </Text>
        
        {/* Botón de acción principal */}
        <View className="w-full">
          <Button
            title="Iniciar Sesión"
            onPress={goToProfile}
            fullWidth
            size="lg"
          />
        </View>
        
        {/* Texto adicional */}
        <Text className="text-sm text-gray-500 text-center mt-4">
          ¿No tienes cuenta? Puedes registrarte en la misma pantalla
        </Text>
      </View>
    </View>
  );
};

// Export default para Expo Router
export default LoginRequired; 