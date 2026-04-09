import axios from "axios";
import {logoutUser} from "../state/user/userSlice";
import {store} from "../state/store";

let envBase = import.meta.env.VITE_BASE_URL || "";
if (envBase.endsWith("/")) envBase = envBase.slice(0, -1);
const finalBaseUrl = envBase.endsWith("/api") ? envBase : `${envBase}/api`;

const axiosInstance = axios.create({
  baseURL: finalBaseUrl,
});

// 1. המיירט של הבקשות (Request Interceptor) - חדש!
// תפקידו: להדביק את הטוקן לכל קריאה שיוצאת לשרת
axiosInstance.interceptors.request.use(
  (config) => {
    // שולף את הטוקן מהאחסון המקומי
    const token = localStorage.getItem("token");

    if (token) {
      // מדביק את הטוקן לכותרות הבקשה (וודא שהשרת שלך מצפה לפורמט Bearer)
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 2. המיירט של התשובות (Response Interceptor)
// תפקידו: לטפל במצב שהטוקן פג תוקף (401) או שגיאות רשת (שרת בשינה)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // בודק אם זו שגיאת רשת (סבירות גבוהה לשרת בשינה או בעיית CORS)
    // ולפחות לא ניסינו כבר לעשות Retry
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("Network error or CORS block detected. Retrying in 2 seconds (server might be waking up)...");
      
      // מחכה 2 שניות לפני הניסיון החוזר כדי לתת לשרת זמן לעלות
      await new Promise(resolve => setTimeout(resolve, 2000));
      return axiosInstance(originalRequest);
    }

    if (error.response && error.response.status === 401) {
      // Don't redirect/reload if we're already on the auth page to allow toasts to show
      if (window.location.pathname === "/auth") {
        return Promise.reject(error);
      }

      console.warn("Token expired or invalid. Logging out...");
      store.dispatch(logoutUser());
      window.location.href = "/auth";
    }

    // אם עדיין יש שגיאה אחרי ה-Retry, או שזו שגיאה אחרת
    return Promise.reject(error);
  },
);


export default axiosInstance;
