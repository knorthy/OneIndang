import { Stack } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ServicesLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Stack.Screen
        name="services"
        options={{
          title: 'Services',
        }}
      />
    </Stack>
  );
}