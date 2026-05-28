import { Stack } from "expo-router";

export default function SuperAdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="schools" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="subscriptions" />
      <Stack.Screen name="users" />
    </Stack>
  );
}
