import React, { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import "./styles/globals.css";
import { ProductoProvider } from "./context/ProductoContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ComerciosProvider } from "./context/ComerciosContext";
import { TermsProvider, useTerms } from "./context/TermsContext";
import { StatusBar, View, Text, ActivityIndicator } from "react-native";

function AppNavigator() {
  const { hasAcceptedTerms, isLoading: termsLoading } = useTerms();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [hasCheckedTerms, setHasCheckedTerms] = useState(false);

  useEffect(() => {
    if (!termsLoading && !authLoading && !hasCheckedTerms) {
      if (!hasAcceptedTerms && !isLoggedIn) {
        router.replace('/terms');
      }
      setHasCheckedTerms(true);
    }
  }, [hasAcceptedTerms, isLoggedIn, termsLoading, authLoading, hasCheckedTerms]);

  if (termsLoading || authLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-50">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-purple-600 mt-4">Cargando SuperTracker...</Text>
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
              <Stack.Screen name="terms" options={{ headerShown: false }} />
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
              <Stack.Screen name="pages/micomercio" options={{ headerShown: false }} />
              <Stack.Screen name="pages/mis-comercios" options={{ headerShown: false }} />
              <Stack.Screen name="comparador" options={{ headerShown: false }} />
              <Stack.Screen name="ofertas" options={{ headerShown: false }} />
              <Stack.Screen name="configuracion/index" options={{ headerShown: false }} />
              <Stack.Screen name="configuracion/ajustes" options={{ headerShown: false }} />
              <Stack.Screen name="configuracion/cuenta" options={{ headerShown: false }} />
              <Stack.Screen name="configuracion/notificaciones" options={{ headerShown: false }} />
              <Stack.Screen name="shopping-list/[id]" options={{ headerShown: false }} />
            </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <TermsProvider>
        <ProductoProvider>
          <ComerciosProvider>
            <StatusBar backgroundColor="#f5f3ff" barStyle="dark-content" />
            <AppNavigator />
          </ComerciosProvider>
        </ProductoProvider>
      </TermsProvider>
    </AuthProvider>
  );
}
