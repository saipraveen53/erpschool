import { Stack } from "expo-router";

export default function DriverLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="routes/assigned" />
      <Stack.Screen name="students/pickup-list" />
      <Stack.Screen name="attendance/confirmation" />
      <Stack.Screen name="tracking/gps" />
      <Stack.Screen name="vehicle/reporting" />
      <Stack.Screen name="alerts/emergency" />
      <Stack.Screen name="inspection" />
      <Stack.Screen name="fuel-tracking" />
      <Stack.Screen name="report-incident" />
      <Stack.Screen name="profile" />
      {/* Add common notifications screen accessible from driver */}
      <Stack.Screen name="common/notifications" options={{ presentation: "modal" }} />
    </Stack>
  );
}