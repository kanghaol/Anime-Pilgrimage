import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, Pressable, Image } from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import MapView, { Marker, UrlTile, Circle } from "react-native-maps";
import { useColorScheme } from "nativewind";
import * as Clipboard from "expo-clipboard";
import * as Location from "expo-location";

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

type MapMode = "PARAMS" | "DEFAULT" | "ALL";

const API_BASE = "http://192.168.0.152:5000/api";

const LIGHT_TILES = "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png";
const DARK_TILES = "https://a.tile.opentopomap.org/{z}/{x}/{y}.png";

export default function MapScreen() {
  const [mapMode, setMapMode] = useState<MapMode>("DEFAULT");
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { location, locations } = useLocalSearchParams<{
    location?: string;
    locations?: string;
  }>();
  const [locationList, setLocationList] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fetchingAll, setFetchingAll] = useState<boolean>(false);
  const mapRef = useRef<MapView>(null);
  const [skipAutoCenter, setSkipAutoCenter] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);

  /* ---------------- FETCH ALL LOCATIONS ---------------- */

  const fetchAllLocations = async () => {
    try {
      setLoading(true);
      setFetchingAll(true);
      setMapMode("ALL");
      setSkipAutoCenter(true);
      centerOnJapan();
      const res = await fetch(`${API_BASE}/locations/all`);
      const data = await res.json();
      setLocationList(Array.isArray(data.locations) ? data.locations : []);
    } catch (e) {
      console.error("Fetch all error:", e);
    } finally {
      setFetchingAll(false);
      setLoading(false);
    }
  };

  /* ---------------- LOAD some locations base on request DATA  ---------------- */
  useEffect(() => {
    if (location) {
      setMapMode("PARAMS");
      setLocationList([JSON.parse(location)]);
      setLoading(false);
      return;
    }

    if (locations) {
      setMapMode("PARAMS");
      setLocationList(JSON.parse(locations));
      setLoading(false);
      return;
    }
  }, [location, locations]);

  useFocusEffect(
    useCallback(() => {
      if (mapMode === "DEFAULT") {
        //all location as default for now
        fetchAllLocations();
      }
    }, [mapMode])
  );


  /* ---------------- GET USER LOCATION ---------------- */
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission denied");
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (loc) => {
          setUserLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
          setLocationAccuracy(loc.coords.accuracy ?? null);
        }
      );
    };

    startTracking();

    return () => {
      subscription?.remove();
    };
  }, []);
  /* ---------------- CENTER ---------------- */
  useEffect(() => {
    if (!mapRef.current) return;
    if (skipAutoCenter) return;
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

  const centerOnJapan = () => {
    if (!mapRef.current) return;

    mapRef.current.animateToRegion(
      {
        latitude: 36.2048,
        longitude: 138.2529,
        latitudeDelta: 15,
        longitudeDelta: 15,
      },
      600
    );
    setTimeout(() => {
      setSkipAutoCenter(false);
    }, 600);
  };

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
        mapType="none"
        initialRegion={{
          latitude: 35.0,
          longitude: 135.0,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {/* OpenStreetMap tile texture optional*/}
        {/* <UrlTile
          urlTemplate={isDark ? DARK_TILES : LIGHT_TILES}
          maximumZ={19}
        /> */}

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
        {/* USER LOCATION */}
        {userLocation && (
          <>
            {/* Accuracy circle */}
            {locationAccuracy && (
              <Circle
                center={userLocation}
                radius={locationAccuracy}
                strokeColor="rgba(59,130,246,0.4)"
                fillColor="rgba(59,130,246,0.15)"
              />
            )}

            {/* User marker */}
            <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }}>
              <View className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
            </Marker>
          </>
        )}
      </MapView>

      <View className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded">
        <Text className="text-[10px] text-white">
          © OpenStreetMap contributors
        </Text>
      </View>
      {/* View All Locations Button */}
      <Pressable
        onPress={fetchAllLocations}
        disabled={mapMode === "ALL" || fetchingAll}
        className={`absolute top-14 right-4 px-4 py-2 rounded-full shadow-lg
                    ${mapMode === "ALL"
            ? "bg-gray-300 dark:bg-gray-700"
            : "bg-white/90 dark:bg-gray-800"}
                  `}
      >
        <Text className="text-sm font-semibold text-gray-900 dark:text-white">
          {fetchingAll ? "Loading…" : mapMode === "ALL" ? "All Shown" : "View All Locations"}
        </Text>
      </Pressable>
      {/* Center on User Button */}
      {userLocation && (
        <Pressable

          onPress={() => {
            mapRef.current?.animateToRegion(
              {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              500
            );
          }}
          className="absolute top-28 right-4 px-4 py-2 rounded-full bg-indigo-600 shadow-lg"
        >
          <Text className="text-white font-semibold text-sm">
            Center on Me
          </Text>
        </Pressable>
      )}
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
