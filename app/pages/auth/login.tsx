import {
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import Logo from "../../components/Logo";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation, useRouter } from "expo-router";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const register = () => {
    router.push("pages/auth/register");
  };

  const login = () => {
    if (!email || !password) {
      alert("Por favor, completa todos los campos");
      return;
    }
    setLoading(true);

    if (email === "ejemplo@gmail.com" && password === "123456") {
      setTimeout(() => {
        setLoading(false);
        console.log("Inicio de sesión exitoso", email, password);
        alert("Bienvenido de nuevo");
        router.push("/tabs/index");
      }, 1000);
    } else {
      setEmail("");
      setPassword("");
      setLoading(false);
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <ScrollView className="bg-purple-50 flex-1">
      <View className="flex-1 items-center justify-center px-6 py-8">
        <View className="w-full max-w-md mt-28">
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
            <Pressable onPress={login}>
              <View className="bg-purple-600 rounded-xl px-3 py-3 mt-8">
                <Text className="text-white text-center text-lg font-semibold">
                  Iniciar sesión
                </Text>
              </View>
            </Pressable>
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
  );
};

export default Login;
