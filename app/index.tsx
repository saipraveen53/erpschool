import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "./contexts/AuthContext";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        const role = user.role?.toUpperCase();
        if (role === "SUPER_ADMIN") {
          router.replace("/(dashboard)/super-admin");
        } else if (role === "ADMIN") {
          router.replace("/(dashboard)/admin");
        } else if (role === "PRINCIPAL") {
          router.replace("/(dashboard)/principal");
        } else if (role === "VICE_PRINCIPAL") {
          router.replace("/(dashboard)/vice-principal");
        } else if (role === "TEACHER") {
          router.replace("/(dashboard)/teacher");
        } else if (role === "STUDENT") {
          router.replace("/(dashboard)/student");
        } else if (role === "PARENT") {
          router.replace("/(dashboard)/parent");
        } else if (role === "DRIVER") {
          // Timeout theesesaam & route fix chesam
          router.replace("/(dashboard)/driver");
        } else if (role === "HOUSEKEEPING") {
          router.replace("/(dashboard)/housekeeping");
        } else if (role === "RECEPTIONIST") {
          router.replace("/(dashboard)/receptionist");
        } else if (role === "LIBRARIAN") {
          router.replace("/(dashboard)/librarian");
        } else {
          router.replace("/(dashboard)/admin");
        }
      } else {
        router.replace("/(public)/home");
      }
    }
  }, [isAuthenticated, isLoading, user]);

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
