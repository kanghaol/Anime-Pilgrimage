import React from "react";
import { View, Text} from "react-native"
export default function InfoRow({ icon, label, value }: any) {
  return (
    <View className="flex-row items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl mb-3">
      {icon}
      <View>
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {label}
        </Text>
        <Text className="font-medium text-gray-900 dark:text-white">
          {value}
        </Text>
      </View>
    </View>
  );
}