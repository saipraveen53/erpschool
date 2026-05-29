import { Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Normalize role to uppercase and ensure it's a string
  const role = user?.role?.toUpperCase() || "";

  console.log("🔍 Dashboard role:", role); // Terminal lo check cheyandi

  // Allowed roles mapping
  const roleTabs: Record<string, string> = {
    SUPER_ADMIN: "super-admin",
    ADMIN: "admin",
    PRINCIPAL: "principal",
    VICE_PRINCIPAL: "vice-principal",
    TEACHER: "teacher",
    STUDENT: "student",
    PARENT: "parent",
    DRIVER: "driver",
    HOUSEKEEPING: "housekeeping",
    RECEPTIONIST: "receptionist",
    LIBRARIAN: "librarian",
  };

  const tabName = roleTabs[role];

  // If role is not recognized, show nothing (or fallback to login)
  if (!tabName) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={tabName} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
