import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { Search, Sparkles, TrendingUp, User } from "lucide-react-native";
import { MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { router } from "expo-router";
import AnimeCard from "@/components/AnimeCard";

const API_BASE = "http://192.168.0.152:5000/api";

export default function Home() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [nextPopularity, setNextPopularity] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { isGuest, logout, isLoggedIn } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();

  // if (!isLoggedIn && !isGuest) {
  //   return <Redirect href="/login" />;
  // }
  
  const fetchAnimeList = async (cursorId?: string, cursorPopularity?: number) => {
    try {
      const url = new URL(`${API_BASE}/anime/AnimeList`);
      if (cursorId) url.searchParams.append("id", cursorId);
      if (cursorPopularity !== undefined)
        url.searchParams.append("popularity", cursorPopularity.toString());

      const res = await fetch(url.toString());
      const data = await res.json();

      if (!res.ok) {
        console.error("API Error:", data);
        return;
      }

      setAnimeList((prev) =>
        cursorId ? [...prev, ...data.animeList] : data.animeList
      );

      setNextCursor(data.nextCursor);
      setNextPopularity(data.nextPopularity);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn && !isGuest) {
      router.replace("/login");
    } 
  }, [isLoggedIn, isGuest]);

  const loadMoreAnime = async () => {
    if (!hasMore) return;
    if (!nextCursor || nextPopularity === null) return;
    try {
      setLoadingMore(true);
      await fetchAnimeList(nextCursor, nextPopularity);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchAnimeList();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background dark:bg-darkBackground">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="text-gray-500 mt-4">Loading anime...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background dark:bg-darkBackground"
    >
      {/* Header */}
      <View className="bg-primary dark:bg-darkBackground px-6 py-4">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-2">
            <Sparkles color="#FFFFFF" size={24} />
            <Text className="text-white dark:text-darkAccent text-2xl font-bold">
              Anime Pilgrimage
            </Text>
          </View>

          {/* Profile */}
          <Link href="/profile" asChild>
            <Pressable
              className="w-10 h-10 bg-white/20 dark:bg-darkPrimary rounded-full justify-center items-center"
              onPress={logout}
            >
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
        <Text className="text-xl font-semibold text-text dark:text-darkText">
          Explore Popular Series
        </Text>
      </View>

      {/* Anime List */}
      <FlatList
        data={animeList}
        keyExtractor={(item) => item.anime_id}
        contentContainerStyle={{ padding: 16, paddingBottom: 150 }}
        renderItem={({ item, index }) => (
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
        )}
        ListFooterComponent={() => (
          <View className="mt-6 mb-20 justify-center items-center">
            {hasMore ? (
              <Pressable
                onPress={loadMoreAnime}
                className="bg-accent dark:bg-darkAccent px-6 py-3 rounded-full"
              >
                <Text className="text-white text-center text-base font-semibold">
                  {loadingMore ? "Loading..." : "Load More"}
                </Text>
              </Pressable>
            ) : (
              <Text className="text-subtext dark: dark:text-darkSubtext mt-6">No more anime available</Text>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
