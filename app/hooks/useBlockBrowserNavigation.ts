// app/hooks/useBlockBrowserNavigation.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

export function useBlockBrowserNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const isBlockingRef = useRef(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // List of protected routes where back button should be blocked
    const protectedRoutes = [
      '/driver',
      '/driver/',
      '/driver/attendance',
      '/driver/routes',
      '/driver/students',
      '/driver/tracking',
      '/driver/vehicle',
      '/dashboard'
    ];

    const isProtectedRoute = protectedRoutes.some(route => 
      pathname === route || pathname.startsWith(route + '/')
    );

    if (!isProtectedRoute) return;

    // Function to check authentication and redirect
    const checkAndRedirect = async () => {
      const authenticated = await AsyncStorage.getItem("authenticated");
      const role = await AsyncStorage.getItem("userRole");
      
      if (authenticated !== "true") {
        window.location.replace('/login');
        return;
      }

      // Ensure we're on the correct dashboard for the role
      if (role?.toUpperCase() === 'DRIVER' && !pathname.startsWith('/driver')) {
        window.location.replace('/driver');
      }
    };

    // Block back/forward navigation
    const handlePopState = async (event: PopStateEvent) => {
      event.preventDefault();
      
      const authenticated = await AsyncStorage.getItem("authenticated");
      const role = await AsyncStorage.getItem("userRole");
      const currentPath = window.location.pathname;
      
      // Prevent navigation away from protected routes
      if (authenticated === "true") {
        // If trying to go to login or home, redirect back to dashboard
        if (currentPath === '/login' || 
            currentPath === '/home' || 
            currentPath === '/' ||
            currentPath.includes('/(auth)')) {
          
          const roleMap: Record<string, string> = {
            DRIVER: '/driver',
            SUPER_ADMIN: '/super-admin',
            ADMIN: '/admin',
            PRINCIPAL: '/principal',
            VICE_PRINCIPAL: '/vice-principal',
            TEACHER: '/teacher',
            STUDENT: '/student',
            PARENT: '/parent',
          };
          
          const dashboardPath = roleMap[role?.toUpperCase() || ''] || '/driver';
          
          // Replace the current history state instead of pushing
          window.history.replaceState(null, '', dashboardPath);
          router.replace(dashboardPath);
          return;
        }
        
        // Push current state to prevent back navigation
        window.history.pushState(null, '', currentPath);
      }
    };

    // Initial setup - push current state to create a history entry
    if (!isBlockingRef.current) {
      window.history.pushState(null, '', pathname);
      isBlockingRef.current = true;
    }

    // Add event listeners
    window.addEventListener('popstate', handlePopState);
    
    // Check authentication on mount and route changes
    checkAndRedirect();

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname, router]);
}