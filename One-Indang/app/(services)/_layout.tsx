import { Stack } from 'expo-router';

export default function ServicesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ✅ This hides the default "<- (services)" header
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="detail" />
      <Stack.Screen name="guide" />
    </Stack>
  );
}