import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen
        name="main"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="citizen"
        options={{
          title: 'Citizen',
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: 'Emergency',
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: 'Signup',
        }}
      />
      <Tabs.Screen
        name="forgotpassword"
        options={{
          title: 'Forgot Password',
        }}
      />
      <Tabs.Screen
        name="transpo"
        options={{
          title: 'Transpo',
        }}
      />
    </Tabs>
  );
}