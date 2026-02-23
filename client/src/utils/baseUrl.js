import axios from "axios";

let envBase = import.meta.env.VITE_BASE_URL || "";
// Strip trailing slash if exists, then explicitly add /api if missing
if (envBase.endsWith('/')) envBase = envBase.slice(0, -1);
const finalBaseUrl = envBase.endsWith('/api') ? envBase : `${envBase}/api`;

const axiosInstance = axios.create({
  baseURL: finalBaseUrl,
});

export default axiosInstance;
