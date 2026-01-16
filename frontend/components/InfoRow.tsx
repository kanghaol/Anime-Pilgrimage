import React from "react";
import { View, Text } from "react-native"

type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export default function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View className="flex-row items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      {icon && (
        <View className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/20 items-center justify-center">
          {icon}
        </View>
      )}

      <View className="flex-1">
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {label}
        </Text>
        <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </Text>
      </View>
    </View>
  );
}