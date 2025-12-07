// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../hooks/useAuth";
import { FavoritesProvider } from "@/hooks/useFavorites";
import Splash from "@/components/ui/Splash";
import { StatusBar } from "expo-status-bar";
import { Redirect } from "expo-router";
import './globals.css';

function RootNavigator() {
  const { isLoggedIn, isGuest } = useAuth();

  if (isLoggedIn === null) {
    return <Splash/>;
  }

  // Show login/register screens only when not logged in and not a guest
  if (!isLoggedIn && !isGuest) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    );
  }

  // Show main app (tabs) when logged in or guest
  if (isLoggedIn || isGuest) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    );
  }
}

export default function Layout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <StatusBar style="light"/>
        <RootNavigator />
      </FavoritesProvider>
    </AuthProvider>
  );
}
