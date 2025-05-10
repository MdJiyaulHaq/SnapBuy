import axios, { AxiosInstance } from "axios";
import { getToken, clearTokens } from "../utils/auth";

// Use environment variable with fallback for the backend URL
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/";
  // import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/";


// Create an axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", error.response?.data || error.message);

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Token expired or invalid
      clearTokens();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
