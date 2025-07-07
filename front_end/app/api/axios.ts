import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { resetAllStores } from "@/lib/store-reset";
import Router from "next/router";
import { useAuthStore } from "@/stores/auth-store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
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
    if (error.response?.status === 401) {
      // Notify user and logout on JWT expiration
      toast({
        title: "Session expired",
        description: "Your session has expired. Please log in again.",
        duration: 5000,
      });
      // Clear stores and logout
      if (typeof window !== "undefined") {
        const authStore = useAuthStore.getState();
        authStore.logout();
        resetAllStores();
        // Redirect to login (try to extract locale from path)
        const locale = window.location.pathname.split("/")[1] || "en";
        window.location.href = `/${locale}/login`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
