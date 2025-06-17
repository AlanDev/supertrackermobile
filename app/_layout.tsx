import React from "react";
import { Stack } from "expo-router";
import "./globals.css";
import { ProductoProvider } from "@/context/ProductoContext";
import { AuthProvider } from "@/context/AuthContext";
import { ComerciosProvider } from "@/context/ComerciosContext";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductoProvider>
        <ComerciosProvider>
          <StatusBar backgroundColor="#f5f3ff" barStyle="dark-content" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "transparent",
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="auth"
            options={{
              headerShown: false,
              animation: "slide_from_bottom",
              presentation: "modal",
              contentStyle: {
                backgroundColor: "#f5f3ff",
              },
            }}
          />
        </Stack>
        </ComerciosProvider>
      </ProductoProvider>
    </AuthProvider>
  );
}
