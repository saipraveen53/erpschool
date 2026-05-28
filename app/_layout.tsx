import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, AppStateStatus, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';

export default function RootLayout() {
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