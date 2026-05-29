"use client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fake users data for demo
const fakeUsers = [
  {
    id: 1,
    email: "admin@school.com",
    password: "admin123",
    name: "Admin User",
    role: "ADMIN",
  },
  {
    id: 2,
    email: "principal@school.com",
    password: "principal123",
    name: "Principal",
    role: "PRINCIPAL",
  },
  {
    id: 3,
    email: "teacher@school.com",
    password: "teacher123",
    name: "Teacher",
    role: "TEACHER",
  },
  {
    id: 4,
    email: "parent@school.com",
    password: "parent123",
    name: "Parent",
    role: "PARENT",
  },
  {
    id: 5,
    email: "student@school.com",
    password: "student123",
    name: "Student",
    role: "STUDENT",
  },
  {
    id: 6,
    email: "driver@school.com",
    password: "driver123",
    name: "Driver",
    role: "DRIVER",
  },
  {
    id: 7,
    email: "superadmin@school.com",
    password: "super123",
    name: "Super Admin",
    role: "SUPER_ADMIN",
  },
  {
    id: 8,
    email: "housekeeping@school.com",
    password: "housekeeping123",
    name: "House Keeping",
    role: "HOUSEKEEPING",
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check stored token from AsyncStorage
    const loadStoredData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log("Error loading auth data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Find user with matching credentials
      const foundUser = fakeUsers.find(
        (u) => u.email === email && u.password === password,
      );

      if (!foundUser) {
        throw new Error("Invalid email or password");
      }

      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      };

      const fakeToken = `fake-jwt-token-${userData.id}-${Date.now()}`;

      setUser(userData);
      setToken(fakeToken);

      await AsyncStorage.setItem("token", fakeToken);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    name: string;
  }) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const existingUser = fakeUsers.find((u) => u.email === data.email);
      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      // Create new user (in real app, this would be an API call)
      const newUser = {
        id: fakeUsers.length + 1,
        email: data.email,
        password: data.password,
        name: data.name,
        role: "PARENT", // Default role for new registrations
      };

      // In real app, you would save to backend
      // For demo, just login with the new credentials
      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      };

      const fakeToken = `fake-jwt-token-${userData.id}-${Date.now()}`;

      setUser(userData);
      setToken(fakeToken);

      await AsyncStorage.setItem("token", fakeToken);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.log("Error during logout:", error);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        register,
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
