// app/hooks/useWebNavigationGuard.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export function useWebNavigationGuard() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const preventBackNavigation = async () => {
      const authenticated = await AsyncStorage.getItem("authenticated");
      const role = await AsyncStorage.getItem("userRole");
      const currentPath = window.location.pathname;
      
      // Role to dashboard path mapping
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
      
      // If authenticated and trying to access home or auth pages
      if (authenticated === "true") {
        const dashboardPath = roleMap[role?.toUpperCase() || ""] || "/admin";
        
        if (currentPath === '/home' || 
            currentPath.includes('/login') || 
            currentPath.includes('/register') || 
            currentPath.includes('/forgot-password')) {
          window.location.replace(dashboardPath);
          return;
        }
      }
      
      // If not authenticated and trying to access dashboard
      const isDashboardPath = Object.values(roleMap).some(path => currentPath.includes(path));
      if (authenticated !== "true" && isDashboardPath) {
        window.location.replace('/login');
      }
    };

    // Handle popstate (back button)
    const handlePopState = async () => {
      const authenticated = await AsyncStorage.getItem("authenticated");
      const role = await AsyncStorage.getItem("userRole");
      const currentPath = window.location.pathname;
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
      
      if (authenticated === "true") {
        const dashboardPath = roleMap[role?.toUpperCase() || ""] || "/admin";
        
        // Block navigation to home or auth pages
        if (currentPath === '/home' || 
            currentPath.includes('/login') || 
            currentPath.includes('/register') || 
            currentPath.includes('/forgot-password')) {
          window.history.pushState(null, '', dashboardPath);
          router.replace(dashboardPath);
        }
      }
    };

    // Initial check
    preventBackNavigation();
    
    // Add event listener
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);
}