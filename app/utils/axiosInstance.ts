import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
 


// Helper to decode JWT and get expiry timestamp (seconds)
const getTokenExpiry = (token: string): number | null => {
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload.exp ? payload.exp * 1000 : null; // convert to ms
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
};

// Check if token is expired (with optional buffer seconds)
const isTokenExpired = (token: string, bufferSeconds: number = 300): boolean => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return true;
  return Date.now() + bufferSeconds * 1000 >= expiry;
};

// Get remaining minutes until token enters the buffer zone (or expires)
const getMinutesUntilRefreshTrigger = (token: string, bufferSeconds: number = 300): number | null => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return null;
  const now = Date.now();
  const triggerPoint = expiry - bufferSeconds * 1000; // when we start refreshing
  const remainingMs = triggerPoint - now;
  if (remainingMs <= 0) return 0;
  return remainingMs / (1000 * 60);
};

// Flag to prevent multiple refresh calls
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach(cb => cb(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    console.log('🔄 Attempting to refresh access token...');
    const response = await axios.post(
      'http://192.168.88.20:8081/api/student/auth/refresh-token',
      { refreshToken }
    );
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (accessToken && newRefreshToken) {
      await AsyncStorage.setItem('userToken', accessToken);
      await AsyncStorage.setItem('refreshToken', newRefreshToken);
      console.log('✅ Token refreshed successfully. New token stored.');
      return accessToken;
    }
    return null;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    // Clear tokens on refresh failure
    await AsyncStorage.multiRemove(['userToken', 'refreshToken', 'userRole', 'userUsername', 'authenticated']);
    return null;
  }
};

const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};
 
const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance: AxiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  });

  // Request interceptor: check expiry and wait for refresh if needed
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      let token = await getToken();
      if (token) {
        const remainingMin = getMinutesUntilRefreshTrigger(token, 300);
        if (remainingMin !== null) {
          console.log(`⏱️ Token expires in ~${remainingMin.toFixed(1)} minutes (refresh trigger at ${remainingMin <= 0 ? 'NOW' : remainingMin.toFixed(1)} min left)`);
        }
        if (isTokenExpired(token, 300)) {
          console.log('⚠️ Token is within 5-minute buffer or expired. Refreshing...');
          if (!isRefreshing) {
            isRefreshing = true;
            const newToken = await refreshToken();
            isRefreshing = false;
            if (newToken) {
              token = newToken;
              onTokenRefreshed(newToken);
            } else {
              console.log('❌ No valid token after refresh. Request will proceed without Authorization header.');
              return config;
            }
          } else {
            console.log('⏳ Refresh already in progress, waiting...');
            await new Promise<string | null>((resolve) => {
              addRefreshSubscriber((newToken) => resolve(newToken));
            });
            token = await getToken();
            console.log('✅ Queue resumed with fresh token');
          }
        }
      } else {
        console.log('⚠️ No token found in AsyncStorage. Request sent without Authorization.');
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError): Promise<AxiosError> => Promise.reject(error),
  );

  // Response interceptor: handle 401 globally and log remaining time on success
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log remaining time on successful response (optional)
      (async () => {
        const token = await getToken();
        if (token) {
          const remainingMin = getMinutesUntilRefreshTrigger(token, 300);
          if (remainingMin !== null) {
            console.log(`📊 API call succeeded. Token refresh will trigger in ~${remainingMin.toFixed(1)} minutes.`);
          }
        }
      })();
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        console.log('🔄 401 Unauthorized – attempting token refresh...');
        const newToken = await refreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          console.log('✅ Retrying original request with new token');
          return instance(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};


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
export const createExamApi: AxiosInstance = createAxiosInstance("http://192.168.88.24:8081",
);
export const addSubjectApi: AxiosInstance = createAxiosInstance("http://192.168.88.24:8081",
);
export const hallticket192Api: AxiosInstance = createAxiosInstance("http://192.168.88.19:8081",
);
export const addRouteApi: AxiosInstance = createAxiosInstance("http://192.168.88.24:8081",
);
export const holidayApi: AxiosInstance = createAxiosInstance("http://192.168.88.24:8083",
);
export const getHolidaysApi: AxiosInstance = createAxiosInstance("http://192.168.88.24:8083",
);
export const noticeApi: AxiosInstance = createAxiosInstance("http://192.168.88.20:8081",
);
export const createTimetableApi: AxiosInstance = createAxiosInstance("http://192.168.88.24:8083",
);
export const transportApi: AxiosInstance = createAxiosInstance("http://192.168.24.8081",
);
export const teacherAttendanceApi: AxiosInstance = createAxiosInstance("http://192.168.88.13:8081",
);
export const studentAttendanceApi: AxiosInstance = createAxiosInstance("http://192.168.88.13:8081",
);
export const root2Api: AxiosInstance = createAxiosInstance("http://192.168.88.24:8083");
export const rootApi: AxiosInstance = createAxiosInstance("http://192.168.88.20:8081");
export const studentdashboardApi: AxiosInstance = createAxiosInstance("http://192.168.88.20:8081");
export const examsApi: AxiosInstance = createAxiosInstance("http://192.168.88.19:8081");
export const root1Api = createAxiosInstance('http://192.168.88.19:8081');
