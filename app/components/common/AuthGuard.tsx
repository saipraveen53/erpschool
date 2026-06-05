// app/components/common/AuthGuard.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await AsyncStorage.getItem("authenticated");
      const isAuthRoute = pathname.includes('/(auth)');
      
      // If authenticated and trying to access auth routes, redirect to dashboard
      if (authenticated === "true" && isAuthRoute && Platform.OS === 'web') {
        const role = await AsyncStorage.getItem("userRole");
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
        const dashboardPath = roleMap[role?.toUpperCase() || ""] || "/(dashboard)/admin";
        router.replace(dashboardPath);
      }
      
      // If not authenticated and trying to access dashboard, redirect to login
      if (authenticated !== "true" && pathname.includes('/(dashboard)')) {
        router.replace('/(auth)/login');
      }
    };

    checkAuth();
  }, [pathname]);

  return <>{children}</>;
}