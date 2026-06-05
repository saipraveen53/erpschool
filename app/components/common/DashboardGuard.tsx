// app/components/common/DashboardGuard.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const blockBackNavigation = async () => {
      const authenticated = await AsyncStorage.getItem("authenticated");
      const role = await AsyncStorage.getItem("userRole");
      const currentPath = window.location.pathname;
      
      const dashboardRoutes = ['/driver', '/super-admin', '/admin', '/principal', '/teacher', '/student', '/parent'];
      const isDashboardRoute = dashboardRoutes.some(route => 
        currentPath === route || currentPath.startsWith(route + '/')
      );

      if (authenticated === "true" && isDashboardRoute) {
        // Add a history state to block back navigation
        window.history.pushState(null, '', currentPath);
        
        // Handle popstate (back button)
        const handlePopState = (event: PopStateEvent) => {
          const newPath = window.location.pathname;
          const authRoutes = ['/login', '/home', '/', '/register', '/forgot-password'];
          
          if (authRoutes.includes(newPath)) {
            // Redirect back to dashboard
            const roleMap: Record<string, string> = {
              DRIVER: '/driver',
              SUPER_ADMIN: '/super-admin',
              ADMIN: '/admin',
              PRINCIPAL: '/principal',
              TEACHER: '/teacher',
              STUDENT: '/student',
              PARENT: '/parent',
            };
            const dashboardPath = roleMap[role?.toUpperCase() || ''] || '/dashboard';
            window.location.replace(dashboardPath);
          }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
      }
    };

    blockBackNavigation();
  }, [pathname, router]);

  return <>{children}</>;
}