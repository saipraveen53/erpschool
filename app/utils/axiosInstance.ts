import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("userToken");
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance: AxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig,
    ): Promise<InternalAxiosRequestConfig> => {
      const token: string | null = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError): Promise<AxiosError> => Promise.reject(error),
  );

  return instance;
};

export const rootApi: AxiosInstance = createAxiosInstance(
  "http://192.168.88.20:8081",
);
export const subjectApi: AxiosInstance = createAxiosInstance(
  "http://192.168.88.20:8081",
);
export const sectionApi: AxiosInstance = createAxiosInstance("http://192.168.88.20:8081",
);
export const teachersApi: AxiosInstance = createAxiosInstance("http://192.168.88.20:8081",
);
export const classApi: AxiosInstance = createAxiosInstance("http://192.168.88.20:8081",
);
export const studentApi: AxiosInstance = createAxiosInstance("http://192.168.88.20:8081",
);
export const staffApi: AxiosInstance = createAxiosInstance("http://192.168.88.20:8081",
);
export const studentAttendanceApi: AxiosInstance = createAxiosInstance("http://192.168.88.9:8081",
);
export const staffAttendanceApi: AxiosInstance = createAxiosInstance("http://192.168.88.9:8081",
);
export const createExamApi: AxiosInstance = createAxiosInstance("http://192.168.88.19:8081",
);
export const addSubjectApi: AxiosInstance = createAxiosInstance("http://192.168.88.19:8081",
);
export const hallticket192Api: AxiosInstance = createAxiosInstance("http://192.168.88.19:8081",
);
export const addRouteApi: AxiosInstance = createAxiosInstance("http://192.168.88.19:8081",
);
export const holidayApi: AxiosInstance = createAxiosInstance("http://192.168.88.24:8083",
);
export const getHolidaysApi: AxiosInstance = createAxiosInstance("http://192.168.88.24:8083",
);
export const noticeApi: AxiosInstance = createAxiosInstance("http://192.168.88.20:8081",
);
export const createTimetableApi: AxiosInstance = createAxiosInstance("http://192.168.88.24:8083",
);
export const transportApi: AxiosInstance = createAxiosInstance("http://192.168.88.19.8081",
);