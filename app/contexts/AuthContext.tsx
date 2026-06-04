// app/contexts/AuthContext.tsx
"use client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Alert, Platform } from 'react-native';
import { rootApi } from "../utils/axiosInstance";

// Simple JWT decode (base64url)
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }
}

interface User {
  username: string;
  fullName: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored data on app start
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
        const storedRole = await AsyncStorage.getItem("userRole");
        const storedUsername = await AsyncStorage.getItem("userUsername");
        const storedAuth = await AsyncStorage.getItem("authenticated");

        if (storedAuth === "true" && storedToken && storedRole && storedUsername) {
          setToken(storedToken);
          setUser({
            username: storedUsername,
            fullName: storedUsername,
            role: storedRole,
            token: storedToken,
          });
          setAuthenticated(true);
          console.log("✅ Restored user session:", storedRole);
        } else {
          // Clear inconsistent data
          await AsyncStorage.multiRemove([
            "userToken",
            "refreshToken",
            "userRole",
            "userUsername",
            "authenticated"
          ]);
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
        setAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    loadStoredData();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await rootApi.post("/api/student/auth/login", { username, password });
      const { accessToken, refreshToken } = response.data;

      if (!accessToken) throw new Error("No access token received");

      // Decode JWT to get role and username
      const decoded = decodeJWT(accessToken);
      if (!decoded) throw new Error("Invalid token format");

      const role = decoded.role;
      const tokenUsername = decoded.sub || username;

      // Store tokens and user info
      await AsyncStorage.setItem("userToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken || "");
      await AsyncStorage.setItem("userRole", role);
      await AsyncStorage.setItem("userUsername", tokenUsername);
      await AsyncStorage.setItem("authenticated", "true");

      const userData: User = {
        username: tokenUsername,
        fullName: tokenUsername,
        role: role,
        token: accessToken,
      };
      setUser(userData);
      setToken(accessToken);
      setAuthenticated(true);
      console.log("✅ Login successful:", role);
      router.replace("/");
    } catch (error: any) {
      console.error("Login error:", error);
      setAuthenticated(false);
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const confirmLogout = Platform.OS === 'web'
      ? window.confirm("Are you sure you want to logout?")
      : await new Promise((resolve) => {
          Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
              { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
              { text: "Logout", style: "destructive", onPress: () => resolve(true) }
            ]
          );
        });

    if (!confirmLogout) return;

    await AsyncStorage.multiRemove([
      "userToken",
      "refreshToken",
      "userRole",
      "userUsername",
      "authenticated"
    ]);
    setUser(null);
    setToken(null);
    setAuthenticated(false);
    if (Platform.OS === 'web') {
      window.location.href = '/home';
    } else {
      router.replace('/(public)/home');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: authenticated,
        authenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};