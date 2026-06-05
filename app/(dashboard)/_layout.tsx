// app/(dashboard)/_layout.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  // Handle web browser back button prevention
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handlePopState = async (event: PopStateEvent) => {
      const authenticated = await AsyncStorage.getItem("authenticated");
      const role = await AsyncStorage.getItem("userRole");
      const currentPath = window.location.pathname;
      
      // Check if trying to go back to auth pages while authenticated
      const isAuthPath = currentPath.includes('/login') || 
                        currentPath.includes('/register') || 
                        currentPath.includes('/forgot-password');
      
      if (authenticated === "true" && isAuthPath) {
        // Prevent going back to login by replacing the history state
        const roleMap: Record<string, string> = {
          SUPER_ADMIN: "/super-admin",
          ADMIN: "/admin",
          PRINCIPAL: "/principal",
          VICE_PRINCIPAL: "/vice-principal",
          TEACHER: "/teacher",
          STUDENT: "/student",
          PARENT: "/parent",
          DRIVER: "/driver",
          HOUSEKEEPING: "/housekeeping",
          RECEPTIONIST: "/receptionist",
          LIBRARIAN: "/librarian",
        };
        const dashboardPath = roleMap[role?.toUpperCase() || ""] || "/admin";
        window.history.pushState(null, '', dashboardPath);
        router.replace(dashboardPath);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [router]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !pathname.includes('/onboarding')) {
      router.replace('/(auth)/login');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Normalize role to uppercase and ensure it's a string
  const role = user?.role?.toUpperCase() || "";

  console.log("🔍 Dashboard role:", role);

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

  let tabName = roleTabs[role];

  // Bypass auth check for onboarding
  if (pathname === "/super-admin/onboarding") {
    tabName = "super-admin";
  }

  // If role is not recognized, redirect to login
  if (!tabName) {
    // Redirect to login after a short delay
    setTimeout(() => {
      router.replace('/(auth)/login');
    }, 100);
    
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
    backgroundColor: "#F5F5DC", // Match your theme background
  },
});