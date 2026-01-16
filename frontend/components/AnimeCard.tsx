import { Link } from 'expo-router';
import { ChevronRight, MapPin, Star } from "lucide-react-native";
import { MotiView } from "moti";
import React from "react";
import { useColorScheme } from 'nativewind';
import { Image, Pressable, Text, View } from "react-native";

type Anime = {
    anime_id: string;
    title: string;
    studio?: string;
    photo_url?: string;
}
type AnimeCardProps = {
    anime: Anime;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
    locations: number;
}

export default function AnimeCard({ anime, isFavorite, onToggleFavorite, locations, }: AnimeCardProps) {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 500 }}
            className="mb-3"
        >
            <Link href={{ pathname: "/animeDetail/[id]", params: { id: anime.anime_id } }} push asChild>
                <Pressable className="flex-row bg-cardbg dark:bg-gray-900 rounded-2xl border border-border dark:border-darkBorder shadow-sm dark:shadow-none mb-4 p-4">
                    {/* Poster Image */}
                    <View className="w-24 h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 mr-3">
                        {anime.photo_url ? (
                            <Image
                                source={{ uri: anime.photo_url }}
                                resizeMode="cover"
                                className="w-full h-full"
                            />
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <Text className="text-3xl">No Image</Text>
                            </View>
                        )}
                    </View>
                    {/* Anime Info */}
                    <View className="flex-1 justify-between">
                        <View>
                            <Text className="text-lg font-bold text-text dark:text-darkText mb-1" numberOfLines={2}>
                                {anime.title}
                            </Text>
                            {anime.studio ? (
                                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    {anime.studio}
                                </Text>
                            ) : null}
                            {locations > 0 && (
                                <View className="flex-row items-center">
                                    <MapPin size={14} color="#6366F1" />
                                    <Text className="text-indigo-600 dark:text-purple-400 font-medium text-sm ml-1">
                                        {locations} locations
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                    {/* Favorite Icon */}
                    <View className=" justify-between items-end ml-2">
                        <Pressable onPress={(e) => {
                            e.preventDefault();
                            onToggleFavorite(anime.anime_id);
                        }}
                            className="p-2 rounded-full"
                        >
                            <Star size={24} color={isFavorite ? "#ec4899" : "#d1d5db"} fill={isFavorite ? "#ec4899" : "none"} />
                        </Pressable>
                        {/* Map button */}
                        <Link href={{ pathname: "/animeDetail/[id]", params: { id: anime.anime_id } }} push asChild>
                            <Pressable hitSlop={10} onPress={(e) => e.stopPropagation()}
                                className="p-2 rounded-full">
                                <ChevronRight
                                    size={24}
                                    color={isDark ? "#9ca3af" : "#6b7280"}
                                    className="group-hover: text-indigo-600"
                                />
                            </Pressable>
                        </Link>
                    </View>
                </Pressable>
            </Link>
        </MotiView>
    );
}