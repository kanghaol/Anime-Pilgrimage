import React, { useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, Pressable, Image, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import MapView, { Marker, UrlTile, Callout } from "react-native-maps";
import * as Clipboard from "expo-clipboard";

type Location = {
  anime_id: string;
  location_id: string;
  name: string;
  address: string;
  place: string;
  coordinates: number[]; // [lng, lat]
  description: string;
  photo_url: string;
  scene_ref: string[];
  travel_tips: string;
};

const API_BASE = "http://192.168.0.152:5000/api";

export default function MapScreen() {
  const { location, locations } = useLocalSearchParams<{
    location?: string;
    locations?: string;
  }>();

  const [locationList, setLocationList] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        let parsed: Location[] | null = null;

        if (location) {
          parsed = [JSON.parse(location)];
        } else if (locations) {
          parsed = JSON.parse(locations);
        }

        if (parsed) {
          setLocationList(parsed);
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/locations/all`);
        const data = await res.json();
        setLocationList(Array.isArray(data.locations) ? data.locations : []);
        setLoading(false);
      } catch (e) {
        console.error("Map load error:", e);
        setLoading(false);
      }
    };

    load();
  }, [location, locations]);

  /* ---------------- CENTER ---------------- */
  useEffect(() => {
    //added a check inside the hook instead of skipping the hook entirely
    if (!loading && locationList.length > 0 && mapRef.current) {
      const coords = locationList.map((l) => ({
        latitude: l.coordinates[1],
        longitude: l.coordinates[0],
      }));

      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }
  }, [locationList, loading]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-3">Loading map...</Text>
      </View>
    );
  }

  if (!locationList.length) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold">No locations found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg"
        >
          <Text className="text-white">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  /* ---------------- COPY HANDLER ---------------- */
  const handleCopy = async (loc: Location) => {
    await Clipboard.setStringAsync(loc.address);

    setCopiedId(loc.location_id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* ---------------- MAP ---------------- */
  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 35.0,
          longitude: 135.0,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {/* OpenStreetMap */}
        <UrlTile
          urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />

        {/* Markers */}
        {locationList.map((loc) => (
          <Marker
            key={loc.location_id}
            coordinate={{
              latitude: loc.coordinates[1],
              longitude: loc.coordinates[0],
            }}
            tracksViewChanges={false}
            onPress={() => handleCopy(loc)}
          >
            <View className="items-center justify-center">
              {loc.photo_url && (
                <Image
                  source={{ uri: loc.photo_url }}
                  className="w-16 h-10 rounded-md border border-white bg-gray-200"
                />
              )}
              <View className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white -mt-1" />
              <Text className="mt-1 text-[10px] font-bold bg-white/80 px-1 rounded">
                {loc.name}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>
      {/* FIX: crashing the app with copied address 
         Move the "Copied" alert HERE, outside the MapView.
         This will appear at the bottom of the screen.
         It won't crash because it doesn't force the Map to redraw.
      */}
      {copiedId && (
        <View className="absolute bottom-10 self-center bg-indigo-600 px-6 py-3 rounded-full shadow-xl">
          <Text className="text-white font-bold">Address Copied! ✓</Text>
        </View>
      )}
    </View>
  );
}
