import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { Search, Sparkles, TrendingUp, User } from "lucide-react-native";
import { MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import AnimeCard from "@/components/AnimeCard";

const API_BASE = "http://192.168.0.152:5000/api"

export default function Home() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [nextPopularity, setNextPopularity] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { isGuest, isLoggedIn } = useAuth();

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

      // Save cursors for future pagination
      setNextCursor(data.nextCursor);
      setNextPopularity(data.nextPopularity);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreAnime = async () => {
    if (!hasMore) return; // No more data
    if (!nextCursor || nextPopularity === null) return; // No cursor available
    try {
      setLoadingMore(true);
      await fetchAnimeList(nextCursor, nextPopularity);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchAnimeList(); // Initial load
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      if (isGuest) {
        // Load from local storage for guest accounts
        const guestId = await SecureStore.getItemAsync("guest_token");
        const FAVORITES_KEY = `guest_favorites_${guestId}`;
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        } 
      } else {
        // Load from backend for user accounts
        const token = await SecureStore.getItemAsync("token");
        const res = await fetch(`${API_BASE}/user/favorites/ids`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.favorites.length === 0) {
            setFavorites([]);
          }
          setFavorites(data.favorites);
        } else if (res.status === 403){
          logout();
        } else {
          console.error("Failed to load favorites from backend");
        }
      }
    }
    loadFavorites();
  }, [isGuest]);

  //testing logout remove later
  const logout = useAuth().logout;

  const toggleFavorite = async (id: string) => {
    console.log("Toggling favorite:", id);
    const token = await SecureStore.getItemAsync("token");
    const guestId = await SecureStore.getItemAsync("guest_token");
    const FAVORITES_KEY = `guest_favorites_${guestId}`;
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];

      if (isGuest) {
        console.log("local favorite:", id);
        // Save locally for guest accounts
        AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      } else {
        // Save to backend for user accounts
        console.log("saving favorite to backend:", id);
        fetch(`${API_BASE}/user/toggleFavorite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
          body: JSON.stringify({ favorites: id }),
        }).catch((err) => console.error("Backend save failed:", err));
      }

      return updated;
    });
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
            <Pressable className="w-10 h-10 bg-white/20 dark:bg-darkPrimary rounded-full justify-center items-center" onPress={logout}>
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
        keyExtractor={(item) => item.anime_id}
        contentContainerStyle={{ padding: 16, paddingBottom: 150 }}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateY: 40, scale: 0.95 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 120, delay: index * 100 }}
          >
            <AnimeCard
              anime={item}
              isFavorite={favorites.includes(item.anime_id)}
              onToggleFavorite={toggleFavorite}
              locations={item.locations}
            />
          </MotiView>
        )}
        ListFooterComponent={() => (
          <View className="mt-6 mb-20 justify-center items-center">
            {hasMore ? (
              <Pressable
                onPress={loadMoreAnime}
                // disabled={loadingMore}
                className="bg-primary px-6 py-3 rounded-full"
              >
                <Text className="text-white text-center text-base font-semibold">
                  {loadingMore ? "Loading..." : "Load More"}
                </Text>
              </Pressable>
            ) : (
              <Text className="text-gray-400 mt-6">No more anime available</Text>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
