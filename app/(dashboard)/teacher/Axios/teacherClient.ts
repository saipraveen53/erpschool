// Axios/teacherClient.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

// Replace this with your actual backend base URL
const BASE_URL = "http://192.168.88.20:8081";

export const teacherClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// --- REQUEST INTERCEPTOR ---
// Automatically attaches the Auth Token to every request
// --- REQUEST INTERCEPTOR ---
teacherClient.interceptors.request.use(
  async (config) => {
    try {
      // 🔴 Changed "token" to "userToken" based on your storage
      const token =
        Platform.OS === "web"
          ? localStorage.getItem("userToken")
          : await AsyncStorage.getItem("userToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- RESPONSE INTERCEPTOR ---
// Handle global errors like 401 Unauthorized
teacherClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Token expired or unauthorized. Need to log out.");
      // You can trigger a logout event here if needed
    }
    return Promise.reject(error);
  },
);

export default teacherClient;
