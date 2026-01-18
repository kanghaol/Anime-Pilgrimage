import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart, User } from "lucide-react-native";
import { MotiView } from "moti";
import { useColorScheme } from "nativewind"
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import * as SecureStore from "expo-secure-store";
import AnimeCard from "@/components/AnimeCard";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated from "react-native-reanimated";



const API_BASE = "http://192.168.0.152:5000/api";

export default function Favorites() {
  const { isGuest, logout } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const [favoritesList, setFavoritesList] = useState<any[]>([]);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const renderRightActions = () => {
    return(
      <Animated.View className="w-24 h-40 bg-pink-500 items-center justify-center rounded-xl mr-2">
        <Heart size={24} color="white" />
        <Text className="text-white text-sm mt-1">Remove</Text>
      </Animated.View>
    );
  }

  const handleSwipeRemoveFavorite = (animeId: string):void=> {
    setFavoritesList((prev) => prev.filter((item) => item.anime_id !== animeId));
    toggleFavorite(animeId, isGuest);
  }

  useEffect(() => {
    const loadFavorites = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/user/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setFavoritesList(data.favorites || []);
      } else if (res.status === 403) {
        await logout();
        router.replace("/login");
      } else {
        console.error("Failed to load favorites from backend");
      }
    };
    loadFavorites();
  }, [isGuest, favorites]);

  if (favoritesList.length === 0) {
    return (
      <SafeAreaView
        edges={["top", "left", "right"]}
        className="flex-1 bg-background dark:bg-darkBackground"
      >
        <LinearGradient colors={isDark ? ['#FF758C', '#FF7EB3'] : ['#FF9A9E', '#FAD0C4']}>
          <View className="px-6 pt-7 pb-7 ">
            <View className="flex-row justify-between items-center ">
              <View className="flex-row items-center gap-3">
                <Heart color={isDark ? "#B71C4D" : "#ec4899"} size={22} />
                <Text className="items-center justify-center text-bold text-lg text-text dark:text-darkText">
                  Favorites List
                </Text>
              </View>

              {/* Profile */}
              <Link href="/profile" asChild>
                <Pressable className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center">
                  <User color={isDark ? "#e5e7eb" : "#374151"} size={22} />
                </Pressable>
              </Link>
            </View>
          </View>
        </LinearGradient>
        <View className="flex-1 items-center justify-center px-8">
          <Heart size={48} color="#9ca3af" />
          <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-4">
            No favorites yet
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            Tap the heart icon on any anime to save it here
          </Text>

          <Pressable
            onPress={() => router.push("/")}
            className="mt-6 px-6 py-3 rounded-xl bg-indigo-600"
          >
            <Text className="text-white font-semibold">
              Explore Locations
            </Text>
          </Pressable>
        </View>

      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background dark:bg-darkBackground"
    >
      <LinearGradient colors={isDark ? ['#FF758C', '#FF7EB3'] : ['#FF9A9E', '#FAD0C4']}>
        <View className="px-6 pt-7 pb-7 ">
          <View className="flex-row justify-between items-center ">
            <View className="flex-row items-center gap-3">
              <Heart color={isDark ? "#B71C4D" : "#ec4899"} size={22} />
              <Text className="items-center justify-center text-bold text-lg text-text dark:text-darkText">
                Favorites List
              </Text>
            </View>

            {/* Profile */}
            <Link href="/profile" asChild>
              <Pressable className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center">
                <User color={isDark ? "#e5e7eb" : "#374151"} size={22} />
              </Pressable>
            </Link>
          </View>
        </View>
      </LinearGradient>
      {/* Favorites List */}
      <FlatList
        data={favoritesList}
        keyExtractor={(item) => item.anime_id}
        contentContainerStyle={{ padding: 16, paddingBottom: 150 }}
        renderItem={({ item, index }) => (
          <ReanimatedSwipeable
            renderRightActions={renderRightActions}
            friction={2}
            rightThreshold={40}
            onSwipeableOpen={() => handleSwipeRemoveFavorite(item.anime_id)}
          >
            <MotiView
              from={{ opacity: 0, translateY: 40, scale: 0.95 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{
                type: "spring",
                damping: 15,
                stiffness: 120,
                delay: index * 100,
              }}
            >
              <AnimeCard
                anime={item}
                isFavorite={favorites.includes(item.anime_id)}
                onToggleFavorite={() => toggleFavorite(item.anime_id, isGuest)}
                locations={item.locations}
              />
            </MotiView>
          </ReanimatedSwipeable>
        )}
      />
    </SafeAreaView>
  );
}
