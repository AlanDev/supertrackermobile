import React from "react";
import { Stack } from "expo-router";
import "@/styles/globals.css";
import { ProductoProvider } from "@/context/ProductoContext";
import { AuthProvider } from "@/context/AuthContext";
import { ComerciosProvider } from "@/context/ComerciosContext";
import { TermsProvider, useTerms } from "@/context/TermsContext";
import { StatusBar, ActivityIndicator, View } from "react-native";
import { useAuth } from "@/context/AuthContext";

function AppContent() {
  const { hasAcceptedTerms, isLoading: termsLoading } = useTerms();
  const { isLoggedIn, isLoading: authLoading } = useAuth();

  if (termsLoading || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f3ff' }}>
        <ActivityIndicator size="large" color="#075E54" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "transparent",
        },
      }}
    >
      {!hasAcceptedTerms ? (
        <Stack.Screen name="src/app/terms" options={{ headerShown: false }} />
      ) : !isLoggedIn ? (
        <Stack.Screen
          name="src/app/auth"
          options={{
            headerShown: false,
            animation: "slide_from_bottom",
            presentation: "modal",
            contentStyle: {
              backgroundColor: "#f5f3ff",
            },
          }}
        />
      ) : (
        <Stack.Screen name="src/app/(tabs)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <TermsProvider>
      <AuthProvider>
        <ProductoProvider>
          <ComerciosProvider>
            <StatusBar backgroundColor="#f5f3ff" barStyle="dark-content" />
            <AppContent />
          </ComerciosProvider>
        </ProductoProvider>
      </AuthProvider>
    </TermsProvider>
  );
} 