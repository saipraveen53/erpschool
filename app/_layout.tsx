import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRootNavigationState, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';

export default function RootLayout() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const [hasNavigated, setHasNavigated] = useState(false);
  const timeoutRef = useRef<any>(null);

  // ✅ Effect for app start / refresh – check AsyncStorage and navigate
  useEffect(() => {
    const checkAndNavigate = async () => {
      // Wait for root navigation to be ready
      if (!rootNavigationState?.key) return;
      if (hasNavigated) return;

      try {
        const authenticated = await AsyncStorage.getItem("authenticated");
        const role = await AsyncStorage.getItem("userRole");

        if (authenticated === "true" && role) {
          const upperRole = role.toUpperCase();
          console.log("🔍 _layout: Navigating to role:", upperRole);

          timeoutRef.current = setTimeout(() => {
            switch (upperRole) {
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
            setHasNavigated(true);
          }, 100);
        }
      } catch (error) {
        console.error("Error checking AsyncStorage in _layout:", error);
      }
    };

    checkAndNavigate();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [rootNavigationState?.key, hasNavigated]);

  // Existing AppState listener (unchanged)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        RNStatusBar.setBarStyle('light-content');
        RNStatusBar.setBackgroundColor('#2563eb');
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <StatusBar 
              style="light" 
              backgroundColor="#2563eb"
              translucent={false}
            />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="(public)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
            </Stack>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}