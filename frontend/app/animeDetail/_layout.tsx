// app/animeDetail/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
export default function AnimeDetailLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
      <Stack.Screen></Stack.Screen>
    </>
  );
}
