import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Search, X, Loader } from "lucide-react-native";
import AnimeCard from "@/components/AnimeCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/theme-context";

const API_BASE = "http://192.168.0.152:5000/api";

type Anime = {
  anime_id: string;
  title: string;
  studio?: string;
  photo_url?: string;
  locations: number;
};

// Skeleton loader for better perceived performance
const SearchResultSkeleton = () => (
  <View className="flex-row items-center p-4 mb-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
    <View className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4" />
    <View className="flex-1">
      <View className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <View className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
    </View>
  </View>
);

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const { isGuest } = useAuth();
  const { isDark } = useTheme();
 
  const handleSearch = useCallback(async (searchText: string) => {
    setQuery(searchText);
    
    if (searchText.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/anime/search?q=${encodeURIComponent(searchText)}`
      );
      
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-darkBackground">
      {/* Header */}
      <View className="px-4 py-5 border-b border-gray-200 dark:border-gray-800">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={24} color={isDark ? "#e2e8f0" : "#1e293b"} className="text-gray-700 dark:text-gray-300" />
          </Pressable>

          <View className="flex-1 flex-row items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2">
            <Search size={18} color={isDark ? "#e2e8f0" : "#1e293b"} className="text-gray-400 mr-1" />
            <TextInput
              value={query}
              onChangeText={handleSearch}
              placeholder="Search anime by title or studio..."
              placeholderTextColor="#9ca3af"
              autoFocus
              className="flex-1 text-base text-gray-900 dark:text-white ml-2"
              selectionColor="#6366f1"
            />
            {query.length > 0 && (
              <Pressable
                onPress={clearSearch}
                className="p-1 ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                accessibilityLabel="Clear search"
              >
                <X size={20} className="text-gray-500" />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* Results or Messages */}
      <View className="flex-1 px-2">
        {loading ? (
          <View className="flex-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <SearchResultSkeleton key={i} />
            ))}
          </View>
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item) => item.anime_id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => (
              <View className="px-2 mb-3">
                <AnimeCard
                  anime={item}
                  isFavorite={favorites.includes(item.anime_id)}
                  onToggleFavorite={() => toggleFavorite(item.anime_id, isGuest)}
                  locations={item.locations}
                />
              </View>
            )}
          />
        ) : query.length >= 2 ? (
          <View className="flex-1 justify-center items-center px-6 mb-20">
            <View className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
              <Search size={32} className="text-gray-400" />
            </View>
            <Text className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">
              No anime found
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 max-w-xs">
              Try a different title or studio name.
            </Text>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center px-6 mb-20">
            <View className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-full mb-4">
              <Search size={32} className="text-indigo-500 dark:text-indigo-400" />
            </View>
            <Text className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">
              Find your favorite anime
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 max-w-xs">
              Type at least 2 characters to begin your search.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}