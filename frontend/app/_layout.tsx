// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../hooks/useAuth";
import Splash from "@/components/ui/Splash";
import './globals.css';

function RootNavigator() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn === null) {
    return <Splash/>; // loading
  }

  return (
    <Stack>
      {/* Logged-in or guest users */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>

      
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ headerShown: true }} />
      </Stack.Protected>

      <Stack>
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
