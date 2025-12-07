import { View, Text, Pressable } from 'react-native';
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Profile() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 justify-center items-start px-4">
      <Text className="text-2xl font-bold text-text dark:text-darkText">
        Profile🌸
      </Text>
      <Text className="text-subtext dark:text-darkSubtext mt-1">
        Discover real-life places that inspired anime worlds.
      </Text>
      <Pressable onPress={handleLogout}>
        <Text className="text-primary dark:text-darkPrimary font-semibold mt-3 text-3xl">
          Logout
        </Text>
      </Pressable>
    </SafeAreaView >
  )
}