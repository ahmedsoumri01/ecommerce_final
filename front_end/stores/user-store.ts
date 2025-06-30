import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "sonner";
import api from "@/app/api/axios";
import type { AxiosError } from "axios";
import { subscribeToReset } from "@/lib/store-reset";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "client";
  accountStatus: "active" | "blocked";
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "client";
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: "admin" | "client";
}

export interface ChangePasswordData {
  currentPassword?: string;
  newPassword: string;
}

export interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  roleFilter: "all" | "admin" | "client";
  statusFilter: "all" | "active" | "blocked";
}

export interface UserActions {
  // CRUD Operations
  getAllUsers: () => Promise<void>;
  getUserById: (id: string) => Promise<User | null>;
  createUser: (userData: CreateUserData) => Promise<boolean>;
  updateUser: (id: string, userData: UpdateUserData) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  blockUser: (
    id: string,
    accountStatus: "active" | "blocked"
  ) => Promise<boolean>;
  changePassword: (
    id: string,
    passwordData: ChangePasswordData
  ) => Promise<boolean>;

  // UI State Management
  setSelectedUser: (user: User | null) => void;
  setSearchQuery: (query: string) => void;
  setRoleFilter: (role: "all" | "admin" | "client") => void;
  setStatusFilter: (status: "all" | "active" | "blocked") => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  roleFilter: "all",
  statusFilter: "all",
};

export const useUserStore = create<UserState & UserActions>()(
  devtools(
    (set, get) => {
      // Subscribe to store reset
      subscribeToReset(() => {
        set(initialState, false, "users/reset");
      });

      return {
        ...initialState,

        // Get all users
        getAllUsers: async () => {
          set({ isLoading: true, error: null }, false, "users/get-all-start");

          try {
            const response = await api.get("/users");
            const users = response.data;

            set(
              {
                users,
                isLoading: false,
                error: null,
              },
              false,
              "users/get-all-success"
            );
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to fetch users";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "users/get-all-error"
            );

            toast.error(errorMessage);
          }
        },

        // Get user by ID
        getUserById: async (id: string): Promise<User | null> => {
          try {
            const response = await api.get(`/users/${id}`);
            const user = response.data;

            set({ selectedUser: user }, false, "users/get-by-id-success");
            return user;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to fetch user";

            set({ error: errorMessage }, false, "users/get-by-id-error");
            toast.error(errorMessage);
            return null;
          }
        },

        // Create user
        createUser: async (userData: CreateUserData): Promise<boolean> => {
          set({ isLoading: true, error: null }, false, "users/create-start");

          try {
            const response = await api.post("/users/create", userData);
            const { message, user } = response.data;

            // Add new user to the list
            set(
              (state) => ({
                users: [user, ...state.users],
                isLoading: false,
                error: null,
              }),
              false,
              "users/create-success"
            );

            toast.success(message || "User created successfully!");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to create user";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "users/create-error"
            );

            toast.error(errorMessage);
            return false;
          }
        },

        // Update user
        updateUser: async (
          id: string,
          userData: UpdateUserData
        ): Promise<boolean> => {
          set({ isLoading: true, error: null }, false, "users/update-start");

          try {
            const response = await api.put(`/users/${id}`, userData);
            const { message, user } = response.data;

            // Update user in the list
            set(
              (state) => ({
                users: state.users.map((u) => (u._id === id ? user : u)),
                selectedUser:
                  state.selectedUser?._id === id ? user : state.selectedUser,
                isLoading: false,
                error: null,
              }),
              false,
              "users/update-success"
            );

            toast.success(message || "User updated successfully!");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to update user";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "users/update-error"
            );

            toast.error(errorMessage);
            return false;
          }
        },

        // Delete user
        deleteUser: async (id: string): Promise<boolean> => {
          set({ isLoading: true, error: null }, false, "users/delete-start");

          try {
            const response = await api.delete(`/users/${id}`);
            const { message } = response.data;

            // Remove user from the list
            set(
              (state) => ({
                users: state.users.filter((u) => u._id !== id),
                selectedUser:
                  state.selectedUser?._id === id ? null : state.selectedUser,
                isLoading: false,
                error: null,
              }),
              false,
              "users/delete-success"
            );

            toast.success(message || "User deleted successfully!");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to delete user";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "users/delete-error"
            );

            toast.error(errorMessage);
            return false;
          }
        },

        // Block/Unblock user
        blockUser: async (
          id: string,
          accountStatus: "active" | "blocked"
        ): Promise<boolean> => {
          set({ isLoading: true, error: null }, false, "users/block-start");

          try {
            const response = await api.put(`/users/block/${id}`, {
              accountStatus,
            });
            const { message, user } = response.data;

            // Update user in the list
            set(
              (state) => ({
                users: state.users.map((u) => (u._id === id ? user : u)),
                selectedUser:
                  state.selectedUser?._id === id ? user : state.selectedUser,
                isLoading: false,
                error: null,
              }),
              false,
              "users/block-success"
            );

            toast.success(
              message ||
                `User ${
                  accountStatus === "blocked" ? "blocked" : "unblocked"
                } successfully!`
            );
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message ||
              "Failed to update user status";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "users/block-error"
            );

            toast.error(errorMessage);
            return false;
          }
        },

        // Change password
        changePassword: async (
          id: string,
          passwordData: ChangePasswordData
        ): Promise<boolean> => {
          set(
            { isLoading: true, error: null },
            false,
            "users/change-password-start"
          );

          try {
            const response = await api.put(
              `/users/change-password/${id}`,
              passwordData
            );
            const { message } = response.data;

            set(
              { isLoading: false, error: null },
              false,
              "users/change-password-success"
            );

            toast.success(message || "Password changed successfully!");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to change password";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "users/change-password-error"
            );

            toast.error(errorMessage);
            return false;
          }
        },

        // UI State Management
        setSelectedUser: (user: User | null) => {
          set({ selectedUser: user }, false, "users/set-selected");
        },

        setSearchQuery: (query: string) => {
          set({ searchQuery: query }, false, "users/set-search");
        },

        setRoleFilter: (role: "all" | "admin" | "client") => {
          set({ roleFilter: role }, false, "users/set-role-filter");
        },

        setStatusFilter: (status: "all" | "active" | "blocked") => {
          set({ statusFilter: status }, false, "users/set-status-filter");
        },

        clearError: () => {
          set({ error: null }, false, "users/clear-error");
        },

        reset: () => {
          set(initialState, false, "users/reset");
        },
      };
    },
    { name: "user-store" }
  )
);

// Computed selectors
export const useFilteredUsers = () => {
  const { users, searchQuery, roleFilter, statusFilter } = useUserStore();

  return users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.accountStatus === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });
};
