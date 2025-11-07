import { View, Text } from 'react-native';
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 justify-center items-start px-4">
      <Text className="text-2xl font-bold text-text dark:text-darkText">
        Profile🌸
      </Text>
      <Text className="text-subtext dark:text-darkSubtext mt-1">
        Discover real-life places that inspired anime worlds.
      </Text>
    </SafeAreaView >
  )
}