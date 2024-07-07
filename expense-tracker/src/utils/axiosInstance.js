import axios from "axios";
import { getToken } from "./refreshToken";
const axiosInstance = axios.create({
  baseURL: "http://localhost:3030/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let refreshToken = await getToken();
    if (refreshToken) {
      config.headers.Authorization = `Bearer ${refreshToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
