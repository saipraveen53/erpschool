import { Stack } from "expo-router";

export default function ReceptionistLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="admissions" />
      <Stack.Screen name="appointments" />
      <Stack.Screen name="communication" />
      <Stack.Screen name="inquiries" />
      <Stack.Screen name="visitors" />
    </Stack>
  );
}
