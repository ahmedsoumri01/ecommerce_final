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
}

const initialState: AuthState = {
  user: null,
  token: null,
  error: null,
  isAuthenticated: false,
  isLoading: false,
  isFetching: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set, get) => {
        // Subscribe to store reset
        subscribeToReset(() => {
          set(initialState, false, "auth/reset");
        });

        return {
          ...initialState,

          login: async (email: string, password: string): Promise<boolean> => {
            set({ isLoading: true, error: null }, false, "auth/login-start");

            try {
              const response = await api.post("/auth/login", {
                email,
                password,
              });

              const { token, user, message } = response.data;

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

            // Clear localStorage
            localStorage.removeItem("auth-storage");

            toast.success("Logged out successfully");
          },

          clearError: () => {
            set({ error: null }, false, "auth/clear-error");
          },

          checkAuth: async () => {
            const { token } = get();
            if (!token) return;

            set({ isFetching: true }, false, "auth/check-start");

            try {
              // You can add a /me endpoint to verify token validity
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
              // Token is invalid, clear auth state
              set(
                {
                  user: null,
                  token: null,
                  isAuthenticated: false,
                  isFetching: false,
                },
                false,
                "auth/check-error"
              );
            }
          },

          reset: () => {
            set(initialState, false, "auth/reset");
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
      }
    ),
    { name: "auth-store" }
  )
);
