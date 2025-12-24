// app/animeDetail/_layout.tsx
import { Stack } from "expo-router";
export default function AnimeDetailLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Stack.Screen></Stack.Screen>
    </>
  );
}
