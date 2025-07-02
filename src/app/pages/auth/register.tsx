import { 
  Text, 
  View, 
  ScrollView, 
  Pressable, 
  TextInput, 
  ActivityIndicator,
  StatusBar
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logo } from "../../../atoms/Logo";

const Register = () => {
  const router = useRouter();

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
      // Simulación de registro exitoso
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userPassword', password);
      await AsyncStorage.setItem('userLoggedIn', 'true');
      
      setTimeout(() => {
        setLoading(false);
        // Redirigir al perfil después del registro exitoso
        router.replace("/(tabs)/profile");
      }, 1000);
      
      console.log("Cuenta creada con éxito");
    } catch (error) {
      console.log("Error al crear la cuenta:", error);
      setLoading(false);
      alert("Error al crear la cuenta");
    }
  };

  const login = () => {
    router.push("/pages/auth/login");
  };
  
  const goBack = () => {
    router.back();
  };

  return (
    <>
      <StatusBar backgroundColor="#f5f3ff" barStyle="dark-content" />
      <ScrollView className="bg-purple-50 flex-1">
        <View className="flex-1 items-center justify-center px-6 py-8">
          <View className="w-full max-w-md mt-10">
            
            
            <View className="w-full flex-row items-center justify-between mb-4">
              <Pressable
                onPress={goBack}
                className="bg-white p-2 rounded-full border border-gray-200"
              >
                <Ionicons name="arrow-back" size={20} color="#6B46C1" />
              </Pressable>
              <Text className="text-center text-3xl font-bold text-purple-600">
                Registrate
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
              />
              <Text className="text-purple-400 text-xl font-medium mb-1 mt-4">
                Contrasena
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize="none"
                className="bg-white border border-gray-300 rounded-xl px-3 py-3"
                placeholder="Contrasena"
                placeholderTextColor="#BDBDBD"
              />
              <Text className="text-purple-400 text-xl font-medium mb-1 mt-4">
                Confirmar Contrasena
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
                autoCapitalize="none"
                className="bg-white border border-gray-300 rounded-xl px-3 py-3"
                placeholder="Confirmar Contraseña"
                placeholderTextColor="#BDBDBD"
              />

              {error && (
                <Text className="text-red-500 text-sm mt-2 text-center">
                  Las contraseñas no coinciden.
                </Text>
              )}

              <Pressable 
                onPress={crearCuenta}
                disabled={loading}
                className={`${loading ? 'bg-purple-400' : 'bg-purple-600'} rounded-xl px-3 py-3 mt-8`}
              >
                {loading ? (
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
                <Text className="text-gray-500">¿Ya tenes cuenta?</Text>
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
    </>
  );
};

export default Register;
