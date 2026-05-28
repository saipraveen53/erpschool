import { Stack } from "expo-router";

export default function TeacherLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="communication" />
      <Stack.Screen name="examination" />
      <Stack.Screen name="homework" />
      <Stack.Screen name="leave" />
      <Stack.Screen name="lesson-plan" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="timetable" />
    </Stack>
  );
}
