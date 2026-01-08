import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

// ... (keep your other imports)

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // ✅ This ensures NO default headers on any tab
        tabBarActiveTintColor: '#D32F2F', // Brand Red
        tabBarInactiveTintColor: 'gray',
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="main"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />

      {/* ✅ NEW: Services Tab */}
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color }) => <Ionicons name="grid" size={24} color={color} />,
        }}
      />

      {/* Citizen Guide Tab (Existing) */}
      <Tabs.Screen
        name="citizen"
        options={{
          title: 'Citizen',
          tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
        }}
      />

      {/* Emergency Tab (Existing) */}
      <Tabs.Screen
        name="emergency"
        options={{
          title: 'Emergency',
          tabBarIcon: ({ color }) => <Ionicons name="warning" size={24} color={color} />,
        }}
      />
      
      {/* Account Tab (Placeholder) */}
      <Tabs.Screen
        name="account" 
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}