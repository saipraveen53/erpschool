// app/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { useAuth } from "./contexts/AuthContext";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, clearHistoryAndRedirect } = useAuth();
  const rootNavigationState = useRootNavigationState();
  const [hasNavigated, setHasNavigated] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!rootNavigationState?.key || isLoading) return;
    if (hasNavigated) return;

    timeoutRef.current = setTimeout(async () => {
      if (!rootNavigationState?.key) return;

      // Priority 1: AuthContext user
      let role = user?.role?.toUpperCase();

      // Priority 2: If user not available, read directly from AsyncStorage
      if (!role) {
        try {
          const storedAuth = await AsyncStorage.getItem("authenticated");
          const storedRole = await AsyncStorage.getItem("userRole");
          const storedToken = await AsyncStorage.getItem("userToken");

          if (storedAuth === "true" && storedToken && storedRole) {
            role = storedRole.toUpperCase();
            console.log("🔍 Retrieved role from AsyncStorage:", role);
          }
        } catch (err) {
          console.error("Failed to read AsyncStorage in index:", err);
        }
      }

      if (role) {
        console.log("🔍 Navigating to role:", role);
        
        let dashboardPath = "";
        switch (role) {
          case "SUPER_ADMIN":
            dashboardPath = "/(dashboard)/super-admin";
            break;
          case "ADMIN":
            dashboardPath = "/(dashboard)/admin";
            break;
          case "PRINCIPAL":
            dashboardPath = "/(dashboard)/principal";
            break;
          case "VICE_PRINCIPAL":
            dashboardPath = "/(dashboard)/vice-principal";
            break;
          case "TEACHER":
            dashboardPath = "/(dashboard)/teacher";
            break;
          case "STUDENT":
            dashboardPath = "/(dashboard)/student";
            break;
          case "PARENT":
            dashboardPath = "/(dashboard)/parent";
            break;
          case "DRIVER":
            dashboardPath = "/(dashboard)/driver";
            break;
          case "HOUSEKEEPING":
            dashboardPath = "/(dashboard)/housekeeping";
            break;
          case "RECEPTIONIST":
            dashboardPath = "/(dashboard)/receptionist";
            break;
          case "LIBRARIAN":
            dashboardPath = "/(dashboard)/librarian";
            break;
          default:
            dashboardPath = "/(dashboard)/admin";
        }
        
        // Use clearHistoryAndRedirect to completely replace history
        clearHistoryAndRedirect(dashboardPath);
      } else {
        // No valid role → go to public home
        if (Platform.OS === 'web') {
          window.location.replace('/home');
        } else {
          router.replace("/(public)/home");
        }
      }
      setHasNavigated(true);
    }, 100);
  }, [isAuthenticated, isLoading, user, rootNavigationState?.key, hasNavigated]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
});