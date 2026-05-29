import { Stack } from "expo-router";

export default function LibrarianLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="books" />
      <Stack.Screen name="issue-return" />
      <Stack.Screen name="members" />
      <Stack.Screen name="reports" />
    </Stack>
  );
}
