import { Stack } from "expo-router";

export default function ParentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="children" />
      <Stack.Screen name="communication" />
      <Stack.Screen name="examination" />
      <Stack.Screen name="fees" />
      <Stack.Screen name="homework" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="transport" />
    </Stack>
  );
}
