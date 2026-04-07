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

// 2. המיירט של התשובות (Response Interceptor) - הקיים שלך
// תפקידו: לטפל במצב שהטוקן פג תוקף (401)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't redirect/reload if we're already on the auth page to allow toasts to show
      if (window.location.pathname === "/auth") {
        return Promise.reject(error);
      }

      console.warn("Token expired or invalid. Logging out...");
      store.dispatch(logoutUser());
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
