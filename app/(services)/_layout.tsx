import { Stack } from 'expo-router';

export default function ServicesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="services" 
        options={{ 
          headerShown: false // Hides default header to use our custom design
        }} 
      />
    </Stack>
  );
}