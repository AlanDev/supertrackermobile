import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from 'react-native';

export default function AuthLayout() {
  return (
    <>
      <StatusBar backgroundColor="#f5f3ff" barStyle="dark-content" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_bottom",
          presentation: "transparentModal",
          contentStyle: {
            backgroundColor: '#f5f3ff',
          },
        }}
      />
    </>
  );
} 