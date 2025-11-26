// components/Splash.tsx
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

export default function Splash() {
  return (
    <View className="flex-1 items-center justify-center bg-background dark:bg-darkBackground">
      <ActivityIndicator size="large" color="#6366F1" />
      <Text className="mt-4 text-text dark:text-darkText text-lg font-semibold">
        Loading Anime Pilgrimage...
      </Text>
    </View>
  );
}
