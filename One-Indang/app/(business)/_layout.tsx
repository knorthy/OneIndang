import { Stack } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function BusinessLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Stack.Screen name="business" options={{ title: 'Business' }} />
      <Stack.Screen name="[agri]" options={{ title: 'Agriculture' }} />
      <Stack.Screen name="construction" options={{ title: 'Construction' }} />
      <Stack.Screen name="education" options={{ title: 'Education' }} />
      <Stack.Screen name="foodtripind" options={{ title: 'Food Trip' }} />
      <Stack.Screen name="order" options={{ title: 'Order' }} />
      <Stack.Screen name="retailindang" options={{ title: 'Retail' }} />
      <Stack.Screen name="serviceindang" options={{ title: 'Service' }} />
      <Stack.Screen name="tourismindang" options={{ title: 'Tourism' }} />
      <Stack.Screen name="transport" options={{ title: 'Transport' }} />
    </Stack>
  );
}
