import { Stack } from 'expo-router';

export default function ServicesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ✅ CRITICAL: This hides "<- detail" and "<- guide"
      }}
    >
      <Stack.Screen name="detail" options={{ headerShown: false }} />
      <Stack.Screen name="guide" options={{ headerShown: false }} />
    </Stack>
  );
}