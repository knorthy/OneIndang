import { Stack } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ServicesLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hides the header globally for services
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Stack.Screen name="services" />
      <Stack.Screen name="detail" />
      <Stack.Screen name="guide" />
    </Stack>
  );
}