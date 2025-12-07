import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

type FavoritesContextType = {
  favorites: string[];
  toggleFavorite: (id: string, isGuest: boolean) => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

type FavoritesProviderProps = {
  children: ReactNode;
};

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const API_BASE = "http://192.168.0.152:5000/api";

  useEffect(() => {
    const loadFavorites = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        const res = await fetch(`${API_BASE}/user/favorites/ids`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setFavorites(data.favorites || []);
        }
      } else {
        const guestId = await SecureStore.getItemAsync("guest_token");
        const FAVORITES_KEY = `guest_favorites_${guestId}`;
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      }
    };
    loadFavorites();
  }, []);

  const toggleFavorite = async (id: string, isGuest: boolean) => {
  const token = await SecureStore.getItemAsync("token");
  const guestId = await SecureStore.getItemAsync("guest_token");
  const FAVORITES_KEY = `guest_favorites_${guestId}`;

  if (isGuest) {
    setFavorites((prev) => {
      const isFavorited = prev.includes(id);
      const updated = isFavorited
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  } else {
    const isFavorited = favorites.includes(id);
    const method = isFavorited ? "DELETE" : "PUT";

    try {
      const res = await fetch(`${API_BASE}/user/favorites`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ favorites: id }),
      });

      if (res.ok) {
        setFavorites((prev) =>
          isFavorited ? prev.filter((f) => f !== id) : [...prev, id]
        );
      }
    } catch (err) {
      console.error("Backend save failed:", err);
    }
  }
};

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
