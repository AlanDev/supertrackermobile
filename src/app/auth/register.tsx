import { 
  Text, 
  View, 
  ScrollView, 
  Pressable, 
  TextInput, 
  ActivityIndicator
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const router = useRouter();
  const { register: authRegister, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const crearCuenta = async () => {
    if (!email || !password || !confirmPassword) {
      alert("Por favor, completa todos los campos");
      return;
    }
    
    if (password !== confirmPassword) {
      console.log("Las contraseñas no coinciden");
      setError(true);
      return;
    }
    
    setLoading(true);
    setError(false);

    try {
      const success = await authRegister(email, password);
      
      if (success) {
        console.log("Cuenta creada con éxito");
        router.replace("/(tabs)/profile");
      } else {
        alert("Error al crear la cuenta");
      }
    } catch (error) {
      console.log("Error al crear la cuenta:", error);
      alert("Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    router.push("/auth/login" as any);
  };
  
  const goBack = () => {
    router.navigate("/(tabs)");
  };

  const isFormLoading = loading || authLoading;

  return (
    <ScrollView className="bg-purple-50 flex-1 pt-12">
      <View className="flex-1 items-center justify-center px-6 py-4">
        <View className="w-full max-w-md">
          <View className="w-full flex-row items-center justify-between mb-4">
            <Pressable
              onPress={goBack}
              className="bg-white p-2 rounded-full border border-gray-200"
            >
              <Ionicons name="arrow-back" size={20} color="#6B46C1" />
            </Pressable>
            <Text className="text-center text-3xl font-bold text-purple-600">
              Regístrate
            </Text>
            <View style={{ width: 30 }} />
          </View>
          
          <Text className="text-center text-gray-500 mt-2 mb-6">
            Accede a todas las funciones de la app
          </Text>

          <View className="mb-4">
            <Text className="text-purple-400 text-xl font-medium mb-1">
              Correo electrónico
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="bg-white border border-gray-300 rounded-xl px-3 py-3"
              placeholder="Correo electrónico"
              placeholderTextColor="#BDBDBD"
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isFormLoading}
            />
            <Text className="text-purple-400 text-xl font-medium mb-1 mt-4">
              Contraseña
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              autoCapitalize="none"
              className="bg-white border border-gray-300 rounded-xl px-3 py-3"
              placeholder="Contraseña"
              placeholderTextColor="#BDBDBD"
              editable={!isFormLoading}
            />
            <Text className="text-purple-400 text-xl font-medium mb-1 mt-4">
              Confirmar Contraseña
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              autoCapitalize="none"
              className="bg-white border border-gray-300 rounded-xl px-3 py-3"
              placeholder="Confirmar Contraseña"
              placeholderTextColor="#BDBDBD"
              editable={!isFormLoading}
            />

            {error && (
              <Text className="text-red-500 text-sm mt-2 text-center">
                Las contraseñas no coinciden.
              </Text>
            )}

            <Pressable 
              onPress={crearCuenta}
              disabled={isFormLoading}
              className={`${isFormLoading ? 'bg-purple-400' : 'bg-purple-600'} rounded-xl px-3 py-3 mt-8`}
            >
              {isFormLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Registrarse
                </Text>
              )}
            </Pressable>

            <View className="mt-8">
              <Text className="text-2xl text-gray-400 text-center font-bold">
                Registrarse con
              </Text>
            </View>
            <View className="flex-row justify-center space-x-4 mt-4 gap-4">
              <Pressable>
                <View className="bg-white border border-gray-300 rounded-xl px-4 py-3">
                  <Ionicons name="logo-google" size={24} color="#6B46C1" />
                </View>
              </Pressable>

              <Pressable>
                <View className="bg-white border border-gray-300 rounded-xl px-4 py-3">
                  <Ionicons name="logo-facebook" size={24} color="#6B46C1" />
                </View>
              </Pressable>
              <Pressable>
                <View className="bg-white border border-gray-300 rounded-xl px-4 py-3">
                  <Ionicons name="logo-apple" size={24} color="#6B46C1" />
                </View>
              </Pressable>
            </View>
            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-500">¿Ya tienes cuenta?</Text>
              <Pressable onPress={login}>
                <Text className="text-purple-500 font-semibold ml-2">
                  Iniciar sesión
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Register; 