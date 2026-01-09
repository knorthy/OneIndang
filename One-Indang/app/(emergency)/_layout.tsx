import { Stack } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function EmergencyLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        // This hides the header for all screens within this stack
        headerShown: false, 
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Stack.Screen
        name="emergency"
        options={{
          // Ensure it is hidden here as well
          headerShown: false,
          title: 'Emergency',
        }}
      />
    </Stack>
  );
}