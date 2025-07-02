import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import UserProfile from "../components/UserProfile";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { isLoggedIn, isLoading: authLoading, login, register, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true); // Por defecto muestra login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleAuthForm = () => {
    setShowLogin(!showLogin);
  };

  const handleLogout = () => {
    logout();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor, completa todos los campos");
      return;
    }
    setLoading(true);

    const success = await login(email, password);
    
    if (!success) {
      setEmail("");
      setPassword("");
      alert("Usuario o contraseña incorrectos");
    }
    
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Por favor, completa todos los campos");
      return;
    }
    setLoading(true);

    const success = await register(email, password);
    
    if (!success) {
      alert("Error al registrarse");
    }
    
    setLoading(false);
  };

  if (authLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-50">
        <ActivityIndicator color="#8B5CF6" size="large" />
        <Text className="mt-4 text-gray-500">Verificando sesión...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <ScrollView className="flex-1 bg-purple-50">
        <View className="flex-1 items-center justify-center px-6 py-12">
          <View className="w-full max-w-md">
            <Text className="text-center text-3xl font-bold text-purple-600 mb-2">
              {showLogin ? "Iniciar sesión" : "Registrarse"}
            </Text>
            <Text className="text-center text-gray-500 mb-6">
              {showLogin ? "Accede a tu cuenta" : "Crea una nueva cuenta"}
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
              />
              
              <Pressable 
                onPress={showLogin ? handleLogin : handleRegister}
                disabled={loading}
                className={`${loading ? 'bg-purple-400' : 'bg-purple-600'} rounded-xl px-3 py-3 mt-8`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center text-lg font-semibold">
                    {showLogin ? "Iniciar sesión" : "Registrarse"}
                  </Text>
                )}
              </Pressable>
              
              {showLogin && (
                <Text className="text-center text-gray-500 mt-2">
                  Prueba con: ejemplo@gmail.com / 123456
                </Text>
              )}
              
              <View className="mt-8">
                <Text className="text-2xl text-gray-400 text-center font-bold">
                  {showLogin ? "O" : "Registrarse con"}
                </Text>
              </View>
              
              {/* Botones de redes sociales */}
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
                <Text className="text-gray-500">
                  {showLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
                </Text>
                <Pressable onPress={toggleAuthForm}>
                  <Text className="text-purple-500 font-semibold ml-2">
                    {showLogin ? "Regístrate" : "Iniciar sesión"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
  
  // If logged in, show the profile
  return <UserProfile onLogout={handleLogout} />;
};

export default Profile;
