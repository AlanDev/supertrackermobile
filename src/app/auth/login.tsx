import {
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const router = useRouter();
  const { login: authLogin, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const register = () => {
    router.push("/auth/register" as any);
  };

  const goBack = () => {
    router.navigate("/(tabs)");
  };

  const login = async () => {
    if (!email || !password) {
      alert("Por favor, completa todos los campos");
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await authLogin(email, password);
      
      if (success) {
        console.log("Inicio de sesión exitoso");
        router.back();
      } else {
        setEmail("");
        setPassword("");
        alert("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.log('Error en login:', error);
      alert("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
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
              Iniciar sesión
            </Text>
            <View style={{ width: 30 }} />
          </View>
          
          <Text className="text-center text-gray-500 mt-2 mb-6">
            Accede a tu cuenta
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
            <Pressable 
              onPress={login}
              disabled={isFormLoading}
              className={`${isFormLoading ? 'bg-purple-400' : 'bg-purple-600'} rounded-xl px-3 py-3 mt-8`}
            >
              {isFormLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Iniciar sesión
                </Text>
              )}
            </Pressable>
            
            <Text className="text-center text-gray-500 mt-2">
              Cualquier email y contraseña funcionará
            </Text>
            
            <View className="mt-8">
              <Text className="text-2xl text-gray-400 text-center font-bold">
                O
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
              <Text className="text-gray-500">¿No tienes cuenta?</Text>
              <Pressable onPress={register}>
                <Text className="text-purple-500 font-semibold ml-2">
                  Regístrate
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login; 