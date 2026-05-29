"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useState
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

// Fake users data for demo – includes all dashboard roles
const fakeUsers = [
  {
    id: 1,
    email: "superadmin@school.com",
    password: "super123",
    name: "Super Admin",
    role: "SUPER_ADMIN",
  },
  {
    id: 2,
    email: "admin@school.com",
    password: "admin123",
    name: "Admin User",
    role: "ADMIN",
  },
  {
    id: 3,
    email: "principal@school.com",
    password: "principal123",
    name: "Principal",
    role: "PRINCIPAL",
  },
  {
    id: 4,
    email: "vice@school.com",
    password: "vice123",
    name: "Vice Principal",
    role: "VICE_PRINCIPAL",
  },
  {
    id: 5,
    email: "teacher@school.com",
    password: "teacher123",
    name: "Teacher",
    role: "TEACHER",
  },
  {
    id: 6,
    email: "student@school.com",
    password: "student123",
    name: "Student",
    role: "STUDENT",
  },
  {
    id: 7,
    email: "parent@school.com",
    password: "parent123",
    name: "Parent",
    role: "PARENT",
  },
  {
    id: 8,
    email: "driver@school.com",
    password: "driver123",
    name: "Driver",
    role: "DRIVER",
  },
  {
    id: 9,
    email: "housekeeping@school.com",
    password: "house123",
    name: "Housekeeping Staff",
    role: "HOUSEKEEPING",
  },
  {
    id: 10,
    email: "receptionist@school.com",
    password: "reception123",
    name: "Receptionist",
    role: "RECEPTIONIST",
  },
  {
    id: 11,
    email: "librarian@school.com",
    password: "librarian123",
    name: "Librarian",
    role: "LIBRARIAN",
  },
];

// In-memory storage (no AsyncStorage needed)
let memoryToken: string | null = null;
let memoryUser: User | null = null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(memoryUser);
  const [token, setToken] = useState<string | null>(memoryToken);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

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

      memoryToken = fakeToken;
      memoryUser = userData;

      setUser(userData);
      setToken(fakeToken);

      console.log("Login successful:", userData.role);
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
      await new Promise((resolve) => setTimeout(resolve, 500));

      const existingUser = fakeUsers.find((u) => u.email === data.email);
      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      const newUser = {
        id: fakeUsers.length + 1,
        email: data.email,
        password: data.password,
        name: data.name,
        role: "PARENT",
      };

      fakeUsers.push(newUser);

      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      };

      const fakeToken = `fake-jwt-token-${userData.id}-${Date.now()}`;

      memoryToken = fakeToken;
      memoryUser = userData;

      setUser(userData);
      setToken(fakeToken);
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    memoryToken = null;
    memoryUser = null;
    setUser(null);
    setToken(null);
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