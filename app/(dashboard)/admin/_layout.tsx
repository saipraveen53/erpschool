import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="students" />
      <Stack.Screen name="staff" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="fees" />
      <Stack.Screen name="transport" />
      <Stack.Screen name="examination" />
      <Stack.Screen name="timetable" />
      <Stack.Screen name="classes" />
      <Stack.Screen name="library" />
      <Stack.Screen name="communication" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="holidays" />
    </Stack>
  );
}