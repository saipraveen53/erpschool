import { Stack } from "expo-router";

export default function VicePrincipalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="academics" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="discipline" />
      <Stack.Screen name="examinations" />
    </Stack>
  );
}
