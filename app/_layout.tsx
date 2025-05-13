import { Stack } from "expo-router";
import "./globals.css";
import React from "react";
import { ProductoProvider } from "@/context/ProductoContext";

export default function RootLayout() {
  return (
    <ProductoProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ProductoProvider>
  );
}
