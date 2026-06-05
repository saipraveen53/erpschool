// app/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { useAuth } from "./contexts/AuthContext";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
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
        
        // On web, use replace to prevent back button issues
        const navigationMethod = Platform.OS === 'web' ? router.replace : router.replace;
        
        switch (role) {
          case "SUPER_ADMIN":
            navigationMethod("/(dashboard)/super-admin");
            break;
          case "ADMIN":
            navigationMethod("/(dashboard)/admin");
            break;
          case "PRINCIPAL":
            navigationMethod("/(dashboard)/principal");
            break;
          case "VICE_PRINCIPAL":
            navigationMethod("/(dashboard)/vice-principal");
            break;
          case "TEACHER":
            navigationMethod("/(dashboard)/teacher");
            break;
          case "STUDENT":
            navigationMethod("/(dashboard)/student");
            break;
          case "PARENT":
            navigationMethod("/(dashboard)/parent");
            break;
          case "DRIVER":
            navigationMethod("/(dashboard)/driver");
            break;
          case "HOUSEKEEPING":
            navigationMethod("/(dashboard)/housekeeping");
            break;
          case "RECEPTIONIST":
            navigationMethod("/(dashboard)/receptionist");
            break;
          case "LIBRARIAN":
            navigationMethod("/(dashboard)/librarian");
            break;
          default:
            navigationMethod("/(dashboard)/admin");
        }
      } else {
        // No valid role → go to public home
        router.replace("/(public)/home");
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