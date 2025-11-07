import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { Search, Sparkles, TrendingUp, User } from "lucide-react-native";
import { MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";

import AnimeCard from "@/components/AnimeCard";
import AnimeInfo from "@/assets/data/AnimeInfo.json";
import AnimeLocations from "@/assets/data/AnimeLocations.json";

export default function Home() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate small delay for loading effect can be removed later 
    setTimeout(() => {
      setAnimeList(AnimeInfo);
      setLocations(AnimeLocations);
      setLoading(false);
    }, 500);
  }, []);

  const getLocationCount = (animeId: string) =>
    locations.filter((loc) => loc.anime_id === animeId).length;

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-darkBackground">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="text-gray-500 mt-4">Loading anime...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-background dark:bg-darkBackground">
      {/* Header */}
      <View className="bg-primary dark:bg-darkBackground px-6 py-4">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-2">
            <Sparkles color="#FFFFFF" size={24} />
            <Text className="text-primary dark:text-darkPrimary text-2xl font-bold">Anime Pilgrimage</Text>
          </View>

          {/* Profile */}
          <Link href="/profile" asChild>
            <Pressable className="w-10 h-10 bg-white/20 dark:bg-darkPrimary rounded-full justify-center items-center">
              <User color="white" size={20} />
            </Pressable>
          </Link>
        </View>

        {/* Search */}
        <Link href="/search" asChild>
          <Pressable className="flex-row items-center bg-white/20 dark:bg-darkSubtext rounded-2xl px-4 py-3 border border-border dark:border-darkBorder">
            <Search color="#FFFFFF" size={18} />
            <Text className="text-white ml-2 text-sm">Search anime series...</Text>
          </Pressable>
        </Link>
      </View>

      {/* Section title */}
      <View className="px-6 mt-1 flex-row items-center gap-2">
        <TrendingUp color="#6366F1" size={20} />
        <Text className="text-xl font-semibold text-text dark:text-darkText">Explore Popular Series</Text>
      </View>

      {/* Anime List */}
      <FlatList
        data={animeList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateY: 40, scale:0.95 }}
            animate={{ opacity: 1, translateY: 0, scale:1 }}
            transition={{ type: 'spring', damping:15, stiffness:120, delay: index * 100 }}
          >
            <AnimeCard
              anime={item}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={toggleFavorite}
              locationCount={getLocationCount(item.id)}
            />
          </MotiView>
        )}
      />
    </SafeAreaView>
  );
}
