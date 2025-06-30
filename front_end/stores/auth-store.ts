import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { toast } from "sonner";
import api from "@/app/api/axios";
import type { AxiosError } from "axios";
import { subscribeToReset } from "@/lib/store-reset";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "client";
  accountStatus: "active" | "blocked";
}

export interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isHydrated: boolean;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  reset: () => void;
  setHydrated: () => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  error: null,
  isAuthenticated: false,
  isLoading: false,
  isFetching: false,
  isHydrated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set, get) => {
        // Subscribe to store reset
        subscribeToReset(() => {
          set({ ...initialState, isHydrated: true }, false, "auth/reset");
        });

        return {
          ...initialState,

          setHydrated: () => {
            set({ isHydrated: true }, false, "auth/hydrated");
          },

          login: async (email: string, password: string): Promise<boolean> => {
            set({ isLoading: true, error: null }, false, "auth/login-start");

            try {
              const response = await api.post("/auth/login", {
                email,
                password,
              });

              const { token, user, message } = response.data;

              // Set token in axios headers
              api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

              set(
                {
                  user,
                  token,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                },
                false,
                "auth/login-success"
              );

              toast.success(message || "Login successful!");
              return true;
            } catch (error) {
              const axiosError = error as AxiosError<{ message: string }>;
              const errorMessage =
                axiosError.response?.data?.message || "Login failed";

              set(
                {
                  error: errorMessage,
                  isLoading: false,
                  isAuthenticated: false,
                  user: null,
                  token: null,
                },
                false,
                "auth/login-error"
              );

              toast.error(errorMessage);
              return false;
            }
          },

          register: async (userData): Promise<boolean> => {
            set({ isLoading: true, error: null }, false, "auth/register-start");

            try {
              const response = await api.post("/auth/register", userData);
              const { message } = response.data;

              set(
                { isLoading: false, error: null },
                false,
                "auth/register-success"
              );

              toast.success(message || "Registration successful!");
              return true;
            } catch (error) {
              const axiosError = error as AxiosError<{ message: string }>;
              const errorMessage =
                axiosError.response?.data?.message || "Registration failed";

              set(
                { error: errorMessage, isLoading: false },
                false,
                "auth/register-error"
              );

              toast.error(errorMessage);
              return false;
            }
          },

          logout: () => {
            // Remove token from axios headers
            delete api.defaults.headers.common["Authorization"];

            set(
              {
                user: null,
                token: null,
                isAuthenticated: false,
                error: null,
                isLoading: false,
                isFetching: false,
              },
              false,
              "auth/logout"
            );

            toast.success("Logged out successfully");
          },

          clearError: () => {
            set({ error: null }, false, "auth/clear-error");
          },

          checkAuth: async () => {
            const { token, isHydrated } = get();

            // Don't check auth if not hydrated or no token
            if (!isHydrated || !token) return;

            set({ isFetching: true }, false, "auth/check-start");

            try {
              // Set token in axios headers before making the request
              api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

              const response = await api.get("/auth/me");
              const { user } = response.data;

              set(
                {
                  user,
                  isAuthenticated: true,
                  isFetching: false,
                },
                false,
                "auth/check-success"
              );
            } catch (error) {
              console.warn("Auth check failed:", error);

              // Only clear auth state if it's a 401 (unauthorized) error
              const axiosError = error as AxiosError;
              if (axiosError.response?.status === 401) {
                // Remove token from axios headers
                delete api.defaults.headers.common["Authorization"];

                set(
                  {
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isFetching: false,
                    error: "Session expired. Please login again.",
                  },
                  false,
                  "auth/check-error"
                );

                toast.error("Session expired. Please login again.");
              } else {
                // For other errors (network, server down, etc.), keep the user logged in
                set(
                  {
                    isFetching: false,
                  },
                  false,
                  "auth/check-network-error"
                );
              }
            }
          },

          reset: () => {
            set({ ...initialState, isHydrated: true }, false, "auth/reset");
          },
        };
      },
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          // Set hydrated flag and restore token to axios headers
          if (state) {
            state.setHydrated();
            if (state.token) {
              api.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${state.token}`;
            }
          }
        },
      }
    ),
    { name: "auth-store" }
  )
);
