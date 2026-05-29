import { Stack } from "expo-router";

export default function HousekeepingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="complaints" />
      <Stack.Screen name="inventory" />
      <Stack.Screen name="schedules" />
      <Stack.Screen name="tasks" />
    </Stack>
  );
}
