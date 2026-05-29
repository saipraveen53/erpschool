import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "./contexts/AuthContext";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const rootNavigationState = useRootNavigationState();
  const [hasNavigated, setHasNavigated] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // Wait for root navigation to be ready AND auth to finish loading
    if (!rootNavigationState?.key || isLoading) return;
    if (hasNavigated) return;

    // Defer navigation to next event loop to ensure router is fully ready
    timeoutRef.current = setTimeout(() => {
      if (!rootNavigationState?.key) return; // safety check again

      if (isAuthenticated && user) {
        const role = user.role?.toUpperCase();
        switch (role) {
          case "SUPER_ADMIN":
            router.replace("/(dashboard)/super-admin");
            break;
          case "ADMIN":
            router.replace("/(dashboard)/admin");
            break;
          case "PRINCIPAL":
            router.replace("/(dashboard)/principal");
            break;
          case "VICE_PRINCIPAL":
            router.replace("/(dashboard)/vice-principal");
            break;
          case "TEACHER":
            router.replace("/(dashboard)/teacher");
            break;
          case "STUDENT":
            router.replace("/(dashboard)/student");
            break;
          case "PARENT":
            router.replace("/(dashboard)/parent");
            break;
          case "DRIVER":
            router.replace("/(dashboard)/driver");
            break;
          case "HOUSEKEEPING":
            router.replace("/(dashboard)/housekeeping");
            break;
          case "RECEPTIONIST":
            router.replace("/(dashboard)/receptionist");
            break;
          case "LIBRARIAN":
            router.replace("/(dashboard)/librarian");
            break;
          default:
            router.replace("/(dashboard)/admin");
        }
      } else {
        router.replace("/(public)/home");
      }
      setHasNavigated(true);
    }, 0);
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