// app/hooks/useWebNavigationGuard.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export function useWebNavigationGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Check if user is authenticated
    const checkAuthAndHandleBack = async () => {
      const authenticated = await AsyncStorage.getItem("authenticated");
      const isAuthPage = pathname === '/(auth)/login' || pathname === '/(auth)/register' || pathname === '/(auth)/forgot-password';
      
      if (authenticated === "true" && isAuthPage) {
        // If authenticated and trying to access auth pages, redirect to dashboard
        const role = await AsyncStorage.getItem("userRole");
        if (role) {
          const roleMap: Record<string, string> = {
            SUPER_ADMIN: "/(dashboard)/super-admin",
            ADMIN: "/(dashboard)/admin",
            PRINCIPAL: "/(dashboard)/principal",
            VICE_PRINCIPAL: "/(dashboard)/vice-principal",
            TEACHER: "/(dashboard)/teacher",
            STUDENT: "/(dashboard)/student",
            PARENT: "/(dashboard)/parent",
            DRIVER: "/(dashboard)/driver",
          };
          const dashboardPath = roleMap[role.toUpperCase()] || "/(dashboard)/admin";
          router.replace(dashboardPath);
        }
      }
    };

    checkAuthAndHandleBack();

    // Handle popstate (browser back button)
    const handlePopState = async (event: PopStateEvent) => {
      const authenticated = await AsyncStorage.getItem("authenticated");
      const role = await AsyncStorage.getItem("userRole");
      const currentPath = window.location.pathname;
      
      // Check if trying to go back to auth pages while authenticated
      const isAuthPath = currentPath.includes('/login') || currentPath.includes('/register') || currentPath.includes('/forgot-password');
      
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
        };
        const dashboardPath = roleMap[role?.toUpperCase() || ""] || "/admin";
        window.history.pushState(null, '', dashboardPath);
        router.replace(dashboardPath);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [pathname, router]);
}