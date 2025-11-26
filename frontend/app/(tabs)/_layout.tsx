import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Tabs } from 'expo-router';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';

export default function TabLayout() {
  // Hardcoded colors from your tailwind.config.js
  const lightBackground = "#F9FAFB";      // background
  const darkBackground = "#17181A";       // darkBackground
  const lightActive = "#0EB8F0";          // primary
  const darkActive = "#FFFFFF";            // darkPrimary

  const isDark = false; // Change to true if you want to default dark mode
  const { isLoggedIn } = useAuth();
  
  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? darkActive : lightActive,
        tabBarStyle: {
          backgroundColor: isDark ? darkBackground : lightBackground,
          borderTopColor: 'rgba(0, 0, 0, 0.15)',
          borderTopWidth: 0.5,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="map.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title:'Favorites',
          tabBarIcon:({ color }) => <IconSymbol size={24} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title:'Profile',
          tabBarIcon:({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
