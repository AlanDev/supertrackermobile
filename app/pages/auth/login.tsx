import {
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import Logo from "../../components/Logo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const register = () => {
    // Navegar al registro dentro de la misma estructura de auth
    router.push("/pages/auth/register");
  };

  const login = async () => {
    if (!email || !password) {
      alert("Por favor, completa todos los campos");
      return;
    }
    setLoading(true);

    if (email === "ejemplo@gmail.com" && password === "123456") {
      try {
        // Store credentials in AsyncStorage
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userPassword', password);
        await AsyncStorage.setItem('userLoggedIn', 'true');
        
        setTimeout(() => {
          setLoading(false);
          console.log("Inicio de sesión exitoso", email, password);
          
          // Navegar a profile para mostrar inmediatamente el perfil
          router.replace("/(tabs)/profile");
        }, 1000);
      } catch (error) {
        console.log('Error storing credentials:', error);
        setLoading(false);
        alert("Error al iniciar sesión");
      }
    } else {
      setEmail("");
      setPassword("");
      setLoading(false);
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#f5f3ff" barStyle="dark-content" />
      <ScrollView className="bg-purple-50 flex-1">
        <View className="flex-1 items-center justify-center px-6 py-8">
          <View className="w-full max-w-md mt-10">
            
            
            <Text className="text-center text-3xl font-bold text-purple-600">
              Iniciar sesión
            </Text>
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
              <Pressable 
                onPress={login}
                disabled={loading}
                className={`${loading ? 'bg-purple-400' : 'bg-purple-600'} rounded-xl px-3 py-3 mt-8`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center text-lg font-semibold">
                    Iniciar sesión
                  </Text>
                )}
              </Pressable>
              
              <Text className="text-center text-gray-500 mt-2">
                Prueba con: ejemplo@gmail.com / 123456
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
                <Text className="text-gray-500">¿No tenes cuenta?</Text>
                <Pressable onPress={register}>
                  <Text className="text-purple-500 font-semibold ml-2">
                    Registrate
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

export default Login;
