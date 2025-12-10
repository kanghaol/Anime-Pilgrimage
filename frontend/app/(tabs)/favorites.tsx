import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart, User } from "lucide-react-native";
import { MotiView } from "moti";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites"; 
import * as SecureStore from "expo-secure-store";
import AnimeCard from "@/components/AnimeCard";

export default function Favorites() {
  const { isGuest, logout } = useAuth();
  const { favorites, toggleFavorite } = useFavorites(); 
  const [favoritesList, setFavoritesList] = useState<any[]>([]);
  const API_BASE = "http://192.168.0.152:5000/api";

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

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background dark:bg-darkBackground"
    >
      <View className="flex-row justify-between items-center mb-4 px-6 py-4 text-text dark:text-darkText bg-rose-500/90 dark:bg-darkBackground">
        <View className="flex-row items-center gap-2">
          <Heart color="#FFFFFF" size={28} fill={"#FFFFFF"} />
          <Text className="text-primary dark:text-darkAccent text-2xl font-extrabold">
            Favorites
          </Text>
        </View>

        {/* Profile */}
        <Link href="/profile" asChild>
          <Pressable className="w-10 h-10 bg-white/20 dark:bg-darkPrimary rounded-full justify-center items-center">
            <User color="white" size={20} />
          </Pressable>
        </Link>
      </View>
      {/* <View className="mb-4 px-6">
        <Text className="text-pink-500 font-bold">
          You have {favoritesList.length} favorite
        </Text>
      </View> */}

      {/* Favorites List */}
      <FlatList
        data={favoritesList}
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
      />
    </SafeAreaView>
  );
}
