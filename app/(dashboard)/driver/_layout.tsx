// app/(dashboard)/driver/_layout.tsx
import { Stack } from "expo-router";
import { View } from "react-native";
import { useBlockBrowserNavigation } from "../../hooks/useBlockBrowserNavigation";

export default function DriverLayout() {
  // Add this hook to block browser navigation
  useBlockBrowserNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="attendance" />
        <Stack.Screen name="routes" />
        <Stack.Screen name="students" />
        <Stack.Screen name="tracking" />
        <Stack.Screen name="vehicle" />
        <Stack.Screen name="emergency-sos" />
        <Stack.Screen name="fuel-tracking" />
        <Stack.Screen name="inspection" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="report-incident" />
      </Stack>
    </View>
  );
}