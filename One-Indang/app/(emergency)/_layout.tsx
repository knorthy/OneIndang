import { Stack } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function EmergencyLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Stack.Screen name="emergency" options={{ title: 'Emergency' }} />
    </Stack>
  );
}
