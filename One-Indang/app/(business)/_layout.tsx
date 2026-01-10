import { Stack } from 'expo-router';
import React from 'react';
import { CartProvider } from '../../context/CartContext'; 

export default function BusinessLayout() {
  return (
    <CartProvider>
      <Stack
        screenOptions={{
          headerShown: false, 
          animation: 'slide_from_right', 
        }}
      >
        <Stack.Screen name="business" />
        <Stack.Screen name="foodtripind" />
        <Stack.Screen name="order" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="checkout" />
      </Stack>
    </CartProvider>
  );
}
