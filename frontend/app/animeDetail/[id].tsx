// app/animeDetail/[id].tsx
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, Alert, } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MotiView } from "moti";
import { ArrowLeft, MapPin, Navigation, ArrowRight, BookMarked} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type anime = {
  anime_id: string;
  title: string;
  studio?: string;
  year?: number;
  locations: number;
  photo_url?: string;
  description?: string;
};

type location = {
  anime_id: string;
  location_id: string;
  name: string;
  address: string;
  place: string;
  coordinates: number[];
  description: string;
  photo_url: string;
  scene_ref: string[];
  travel_tips: string;
};

const API_BASE = "http://192.168.0.152:5000/api";

export default function AnimeDetailScreen() {
  const { id } = useLocalSearchParams() as { id?: string };
  const [anime, setAnime] = useState<anime | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [animeLoading, setAnimeLoading] = useState(true);
  const [locationsLoading, setLocationsLoading] = useState(true);

  const fetchAnimeData = async () => {
    try {
      setAnimeLoading(true);
      const res = await fetch(`${API_BASE}/anime/AnimeByID/${id}`);
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Error", "Failed to load anime details. ");
        return;
      }
      setAnime(data.anime);
    } catch (err) {
      Alert.alert("Error", "An error occurred while fetching anime details.");
    } finally {
      setAnimeLoading(false);
    }
  };
  const fetchLocationsData = async () => {
    try {
      setLocationsLoading(true);
      const res = await fetch(`${API_BASE}/locations/LocationsByAnime/${id}`);
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Error", "Failed to load locations.");
        return;
      }
      setLocations(Array.isArray(data.locations) ? data.locations : []);
    } catch (err) {
      Alert.alert("Error", "An error occurred while fetching locations.");
    } finally {
      setLocationsLoading(false);
    }
  }
  // route to map screen and pass one location object if provided
  const viewOnMap = (location: location) => {
    if (location) {
      router.push({
        pathname: "/map",
        params: { location: JSON.stringify(location) },
      });
    }
  };

  //pass an array of all location object to map screen
  const viewOnMapAll = () => {
    router.push({
      pathname: "/map",
      params: { locations: JSON.stringify(locations) },
    });
  }

  useEffect(() => {
    fetchAnimeData();
    fetchLocationsData();
  }, [id]);

  if (animeLoading || locationsLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-darkBackground">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-subtext dark:text-darkSubtext">Loading...</Text>
      </View>
    );
  }

  if (!anime) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-darkBackground px-6">
        <Text className="text-6xl mb-4">Fail to load</Text>
        <Text className="text-xl font-semibold text-text dark:text-darkText mb-2">
          Anime not found
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-3 px-4 py-2 bg-primary rounded-full"
        >
          <Text className="text-white">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-darkBackground">
      <ScrollView className="flex-1 bg-background dark:bg-darkBackground">
        {/* Header */}
        <View className="bg-primary dark:bg-darkBackground px-6 pt-12 pb-6">
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center gap-2 mb-6"
            accessibilityLabel="Go back"
          >
            <ArrowLeft color="#fff" size={24} />
            <Text className="text-white text-lg">Back</Text>
          </Pressable>

          <View className="flex-row gap-4">
            {anime.photo_url ? (
              <Image
                source={{ uri: anime.photo_url }}
                style={{ width: 92, height: 132, borderRadius: 12 }}
              />
            ) : (
              <View
                className="w-24 h-32 rounded-xl bg-gray-100 dark:bg-gray-700 items-center justify-center"
                style={{ width: 92, height: 132, borderRadius: 12 }}
              >
                <Text className="text-2xl">🎌</Text>
              </View>
            )}

            <View className="flex-1">
              <Text className="text-2xl font-bold text-white">{anime.title}</Text>
              {anime.studio ? (
                <Text className="text-sm text-white/90 mt-1">{anime.studio}</Text>
              ) : null}
              {anime.description ? (
                <Text className="text-sm text-white/90 mt-2" numberOfLines={3}>
                  {anime.description}
                </Text>
              ) : null}
              <View className="flex-row items-center gap-2 mt-3">
                <MapPin color="#6366F1" size={20} />
                <Text className="text-white/90">{anime.locations} Reference locations</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {anime.locations > 0 ? (
            <>
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center gap-2">
                  <Navigation color="#6366F1" size={22} />
                  <Text className="text-xl font-bold text-text dark:text-darkText">All Locations</Text>
                </View>

                <Pressable
                  onPress={() => viewOnMapAll()}
                  className="px-3 py-2 rounded-full bg-secondary"
                  accessibilityLabel="View all on map"
                >
                  <View className="flex-row items-center gap-2">
                    <MapPin color="#fff" size={14} />
                    <Text className="text-white">View All on Map</Text>
                  </View>
                </Pressable>
              </View>

              {locations.map((loc: location, idx: number) => {
                return (
                  <MotiView
                    key={loc.location_id ?? idx}
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: idx * 60 }}
                    className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden mb-4 shadow-sm"
                  >
                    <View className="p-4">
                      <View className="flex-row gap-4 ">
                        {loc.photo_url ? (
                          <Image
                            source={{ uri: loc.photo_url }}
                            style={{ width: 96, height: 96, borderRadius: 12 }}
                          />
                        ) : (
                          <View
                            className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700"
                            style={{ width: 96, height: 96, borderRadius: 12 }}
                          />
                        )}

                        <View className="flex-1">
                          <View className="flex-row justify-between items-start">
                            <View className="flex-1">
                              <Text className="font-bold text-lg text-text dark:text-darkSecondary">
                                {loc.name}
                              </Text>
                              <Text className="text-sm text-subtext dark:text-darkSubtext mt-1 ">
                                <MapPin color="#6366F1" size={14} className="" />
                                {loc.place}
                              </Text>

                              {/* Description */}
                              {loc.description && (
                                <Text className="text-sm text-subtext dark:text-darkSubtext mt-3">
                                  {loc.description}
                                </Text>
                              )}

                              {/* Scene reference ABOVE description */}
                              {loc.scene_ref && loc.scene_ref.length > 0 && (
                                <Text className="text-xs text-secondary mt-2">
                                  <BookMarked size={18}></BookMarked>
                                  {loc.scene_ref.join(", ")}
                                </Text>
                              )}
                            </View>

                            <Pressable
                              onPress={() => viewOnMap(loc)}
                              className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20"
                              accessibilityLabel="Open location on map"
                            >
                              <ArrowRight color="#6366F1" size={20} />
                            </Pressable>
                          </View>
                        </View>

                      </View>
                    </View>

                    {loc.address ? (
                      <View className="px-4 py-3 bg-gray-50 dark:bg-darkBackground/60 border-t border-border dark:border-darkBorder">
                        <Text className="text-xs text-subtext dark:text-darkSubtext">
                          <Text className="font-medium">Address: </Text>
                          {loc.address}
                        </Text>
                      </View>
                    ) : null}
                  </MotiView>
                );
              })}
            </>
          ) : (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 items-center">
              <MapPin color="#9CA3AF" size={56} />
              <Text className="text-lg font-semibold text-text dark:text-darkText mt-4">No locations yet</Text>
              <Text className="text-subtext dark:text-darkSubtext mt-2">Locations for this anime will appear here.</Text>
            </MotiView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


