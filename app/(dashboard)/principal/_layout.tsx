import { Stack } from "expo-router";

export default function PrincipalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="communication" />
      <Stack.Screen name="discipline" />
      <Stack.Screen name="examinations" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="staff" />
      <Stack.Screen name="students" />
      <Stack.Screen name="timetable" />
    </Stack>
  );
}
