import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ASSETS_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Token is already set in headers by the auth store
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors globally if needed
    if (error.response?.status === 401) {
      // The auth store will handle this in checkAuth
      console.warn("Unauthorized request:", error.config?.url);
    }

    return Promise.reject(error);
  }
);

export default api;
