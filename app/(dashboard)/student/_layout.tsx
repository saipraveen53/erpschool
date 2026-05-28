import { Stack } from "expo-router";

export default function StudentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="communication" />
      <Stack.Screen name="examinations" />
      <Stack.Screen name="fees" />
      <Stack.Screen name="homework" />
      <Stack.Screen name="library" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="timetable" />
    </Stack>
  );
}
