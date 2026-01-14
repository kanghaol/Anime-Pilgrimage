import { View, Text, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sparkles, User, Trash2, Moon, LogOut, Mail, Shield, MapPin, Heart, Film, Sun, Navigation, Plus } from "lucide-react-native";
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'
import * as SecureStore from "expo-secure-store";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from '@/hooks/useAuth';
import InfoRow from '@/components/InfoRow';


type UserProfile = {
  email: string;
  name: string;
  favorites: [string];
  routes: [string];
}
const API_BASE = "http://192.168.0.152:5000/api";

export default function Profile() {
  const { logout, isGuest } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const fetchUser = async () => {
    try {
      const userToken = await SecureStore.getItemAsync("token");
      if (!userToken) {
        return;
      }
      const res = await fetch(`${API_BASE}/user/profile`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else if (res.status === 403) {
        await logout();
        router.replace("/login");
      }
    } catch (error) {
      console.error("Failed to load user from backend", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isGuest) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [isGuest]);

  if (isGuest) {
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-darkBackground px-6">
      <View className="flex-1 items-center justify-center max-w-sm w-full self-center">

        {/* Icon */}
        <View className="w-20 h-20 rounded-full bg-accent/15 dark:bg-darkAccent/20 items-center justify-center mb-6">
          <User size={42} color="#FF6F61" />
        </View>

        {/* Title */}
        <Text className="text-2xl font-extrabold text-text dark:text-darkText mb-2 text-center">
          Complete Your Profile
        </Text>

        {/* Subtitle */}
        <Text className="text-base text-gray-600 dark:text-gray-400 mb-8 text-center leading-6">
          Create an account to save anime locations, build routes, and unlock
          personalized features.
        </Text>

        {/* Primary CTA */}
        <Pressable
          onPress={() => router.replace("/register")}
          className="w-full bg-accent dark:bg-darkAccent rounded-xl py-4 shadow-lg active:scale-[0.98] active:opacity-90 mb-4"
        >
          <Text className="font-bold text-white text-center text-base">
            Create Free Account
          </Text>
        </Pressable>

        {/* Login */}
        <Pressable
          onPress={() => router.replace("/login")}
          className="py-2 active:opacity-80"
        >
          <Text className="text-gray-600 dark:text-gray-400 text-center">
            Already have an account?
            <Text className="text-accent dark:text-darkAccent font-semibold">
              {" "}Log In
            </Text>
          </Text>
        </Pressable>

        {/* Divider */}
        <View className="flex-row items-center my-6 w-full">
          <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <Text className="mx-3 text-xs text-gray-400 dark:text-gray-500">
            OR
          </Text>
          <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </View>

        {/* Continue as Guest */}
        <Pressable
          onPress={() => router.replace("/")}
          className="py-3 active:opacity-70"
        >
          <Text className="text-gray-500 dark:text-gray-400 text-sm text-center underline">
            Continue as Guest
          </Text>
        </Pressable>

        {/* Trust hint */}
        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
          You can sign up anytime later
        </Text>

      </View>
    </SafeAreaView>
  );
}


  if (loading || !user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* HEADER */}
        <LinearGradient
          colors={["#4f46e5", "#9333ea"]}
          className="px-6 pt-14 pb-10"
        >
          <Animated.View entering={FadeInDown} className="items-center">
            <View className="w-20 h-20 bg-white dark:bg-gray-600 rounded-full items-center justify-center mb-3">
              <User size={40} color="#4f46e5" />
            </View>
            <Text className="text-white text-xl font-bold">
              {user.name}
            </Text>
            <Text className="text-indigo-100 text-sm">
              {user.email}
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* CONTENT */}
        <View className="px-6 py-6">
          {/* STATS */}
          <Animated.View
            entering={FadeInDown.delay(100)}
            className="flex-row gap-3 mb-6"
          >
            <InfoRow icon={<Heart />} value={user.favorites.length} label="Favorites" />
            <InfoRow icon={<Navigation />} value={user.routes.length} label="Routes" />
          </Animated.View>

          {/* SAVED ROUTES */}
          {/* <Animated.View
            entering={FadeInDown.delay(200)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-4 border border-gray-100 dark:border-gray-700"
          >
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Saved Routes
            </Text>

            {user.routes.length === 0 && (
              <View className="items-center py-6">
                <Navigation size={48} className="text-gray-300 dark:text-gray-600 mb-3" />
                <Text className="text-gray-500 dark:text-gray-400 mb-4">
                  No saved routes yet
                </Text>
                <Pressable onPress={() => router.push("/map")}
                  className="border border-indigo-200 rounded-xl px-4 py-2">
                  <Text className="text-indigo-600 font-semibold">
                    Start Planning
                  </Text>
                </Pressable>
              </View>
            )}
          </Animated.View> */}

          {/* ACCOUNT INFO */}
          <Animated.View
            entering={FadeInDown.delay(300)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-4 border border-gray-100 dark:border-gray-700"
          >
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Account Information
            </Text>

            <InfoRow icon={<Mail />} label="Email" value={user.email} />
          </Animated.View>

          {/* LOGOUT */}
          <Animated.View entering={FadeInDown.delay(400)}>
            <Pressable
              onPress={handleLogout}
              className="w-full py-5 rounded-2xl border border-red-200 bg-white items-center flex-row justify-center"
            >
              <LogOut size={20} color="#dc2626" />
              <Text className="text-red-600 font-semibold ml-2">
                Logout
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


