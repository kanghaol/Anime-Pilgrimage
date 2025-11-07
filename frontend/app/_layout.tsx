import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import './globals.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // Manual dark mode state
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View className={darkMode ? 'dark flex-1' : 'flex-1'}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>

      <StatusBar style="auto" />
    </View>
  );
}
