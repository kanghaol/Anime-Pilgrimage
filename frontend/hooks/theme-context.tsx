import React, { useEffect, createContext, useContext, ReactNode, useState } from "react";
import { useColorScheme } from "nativewind";
import * as SecureStore from "expo-secure-store";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: "light" | "dark";
  isDark: boolean;
  toggleTheme: () => void;
  setLight: () => void;
  setDark: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const API_BASE = "http://192.168.0.152:5000/api";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const theme: Theme = colorScheme === "dark" ? "dark" : "light";

  const isDark = theme === "dark";

  /* ---------------- LOAD FROM DB ---------------- */
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (!token) {
          setColorScheme("light");
          return;
        }

        const res = await fetch(`${API_BASE}/user/getTheme`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.theme === "dark" || data.theme === "light") {
            setColorScheme(data.theme);
          }
        }
      } catch (err) {
        console.error("Failed to load theme:", err);
      }
    };

    loadTheme();
  }, []);

  /* ---------------- SAVE TO DB ---------------- */
  const persistTheme = async (next: Theme) => {
    setColorScheme(next);

    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/user/setTheme`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme: next }),
      });

      if (!res.ok) {
        console.log("Theme saved failed:", res.status);
      }
    } catch (err) {
      console.error("Failed to save theme:", err);
    }
  };

  /* ---------------- ACTIONS ---------------- */
  const toggleTheme = () => persistTheme(isDark ? "light" : "dark");
  const setLight = () => persistTheme("light");
  const setDark = () => persistTheme("dark");
  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        setLight,
        setDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
