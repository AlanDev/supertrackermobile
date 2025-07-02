import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        headerStyle: {
          backgroundColor: 'transparent',
        },
        contentStyle: {
          backgroundColor: '#f5f3ff', // Color de fondo morado claro
        },
        headerTitle: "",
        headerBackVisible: false
      }}
    />
  );
} 