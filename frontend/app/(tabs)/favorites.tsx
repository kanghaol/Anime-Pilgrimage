import React from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart, User } from "lucide-react-native";
import { MotiView } from "moti";
import AnimeCard from "@/components/AnimeCard";
export default function Favorites() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-background dark:bg-darkBackground">
      <View className="absolute inset-0 bg-rose-500 dark:bg-gray-800" />
      <View className="flex-row justify-between items-center mb-4 px-6 py-4 text-text dark:text-darkText">
        <View className="flex-row items-center gap-2">
          <Heart color="#FFFFFF" size={28} fill={'#FFFFFF'} />
          <Text className="text-primary dark:text-darkPrimary text-2xl font-extrabold">Favorites</Text>
        </View>

        {/* Profile */}
        <Link href="/profile" asChild>
          <Pressable className="w-10 h-10 bg-white/20 dark:bg-darkPrimary rounded-full justify-center items-center">
            <User color="white" size={20} />
          </Pressable>
        </Link>
      </View>
      <View className="mb-4 px-6">
          <Text className="text-primary dark:text-darkPrimary">Your saved anime list</Text>
      </View>

      {/* Favorites List */}
      <FlatList
        // data={animeList}
        // keyExtractor={(item) => item.id}
        // contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        // renderItem={({ item, index }) => (
        //   <MotiView
        //     from={{ opacity: 0, translateY: 40, scale:0.95 }}
        //     animate={{ opacity: 1, translateY: 0, scale:1 }}
        //     transition={{ type: 'spring', stiffness:100, delay: index * 100 }}
        //   >
        //     <AnimeCard
        //       anime={item}
        //       isFavorite={favorites.includes(item.id)}
        //       onToggleFavorite={toggleFavorite}
        //       locationCount={getLocationCount(item.id)}
        //     />
        //   </MotiView>
        // )}
      />
    </SafeAreaView>

  )
}