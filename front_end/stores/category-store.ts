import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "sonner";
import api from "@/app/api/axios";
import type { AxiosError } from "axios";
import { subscribeToReset } from "@/lib/store-reset";
import { useMemo } from "react";

export interface Category {
  _id: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  icon?: string;
  image?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  publicProductCount: number;
}

export interface CreateCategoryData {
  name: string;
  nameAr?: string;
  nameFr?: string;
  icon?: string;
  featured: boolean;
  image?: File;
}

export interface UpdateCategoryData {
  name?: string;
  nameAr?: string;
  nameFr?: string;
  icon?: string;
  featured?: boolean;
  image?: File;
}

export interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  featuredFilter: "all" | "featured" | "not-featured";
}

export interface CategoryActions {
  // CRUD Operations
  getAllCategories: () => Promise<void>;
  getCategoryById: (id: string) => Promise<Category | null>;
  createCategory: (categoryData: CreateCategoryData) => Promise<boolean>;
  updateCategory: (
    id: string,
    categoryData: UpdateCategoryData
  ) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;

  // UI State Management
  setSelectedCategory: (category: Category | null) => void;
  setSearchQuery: (query: string) => void;
  setFeaturedFilter: (filter: "all" | "featured" | "not-featured") => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  featuredFilter: "all",
};

export const useCategoryStore = create<CategoryState & CategoryActions>()(
  devtools(
    (set, get) => {
      // Subscribe to store reset
      subscribeToReset(() => {
        set(initialState, false, "categories/reset");
      });

      return {
        ...initialState,

        // Get all categories
        getAllCategories: async () => {
          set(
            { isLoading: true, error: null },
            false,
            "categories/get-all-start"
          );

          try {
            const response = await api.get("/categories");
            const categories = response.data;

            set(
              {
                categories,
                isLoading: false,
                error: null,
              },
              false,
              "categories/get-all-success"
            );
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message ||
              "Failed to fetch categories";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "categories/get-all-error"
            );

            toast.error(errorMessage);
          }
        },

        // Get category by ID
        getCategoryById: async (id: string): Promise<Category | null> => {
          try {
            const response = await api.get(`/categories/${id}`);
            const category = response.data;

            set(
              { selectedCategory: category },
              false,
              "categories/get-by-id-success"
            );
            return category;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to fetch category";

            set({ error: errorMessage }, false, "categories/get-by-id-error");
            toast.error(errorMessage);
            return null;
          }
        },

        // Create category
        createCategory: async (
          categoryData: CreateCategoryData
        ): Promise<boolean> => {
          set(
            { isLoading: true, error: null },
            false,
            "categories/create-start"
          );

          try {
            const formData = new FormData();
            formData.append("name", categoryData.name);
            if (categoryData.nameAr)
              formData.append("nameAr", categoryData.nameAr);
            if (categoryData.nameFr)
              formData.append("nameFr", categoryData.nameFr);
            if (categoryData.icon) formData.append("icon", categoryData.icon);
            formData.append("featured", categoryData.featured.toString());
            formData.append("type", "category"); // For multer middleware
            if (categoryData.image)
              formData.append("image", categoryData.image);

            const response = await api.post("/categories/create", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            const { message, category } = response.data;

            // Add new category to the list
            set(
              (state) => ({
                categories: [category, ...state.categories],
                isLoading: false,
                error: null,
              }),
              false,
              "categories/create-success"
            );

            toast.success(message || "Category created successfully!");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to create category";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "categories/create-error"
            );

            toast.error(errorMessage);
            return false;
          }
        },

        // Update category
        updateCategory: async (
          id: string,
          categoryData: UpdateCategoryData
        ): Promise<boolean> => {
          set(
            { isLoading: true, error: null },
            false,
            "categories/update-start"
          );

          try {
            const formData = new FormData();
            if (categoryData.name) formData.append("name", categoryData.name);
            if (categoryData.nameAr !== undefined)
              formData.append("nameAr", categoryData.nameAr);
            if (categoryData.nameFr !== undefined)
              formData.append("nameFr", categoryData.nameFr);
            if (categoryData.icon !== undefined)
              formData.append("icon", categoryData.icon);
            if (categoryData.featured !== undefined)
              formData.append("featured", categoryData.featured.toString());
            formData.append("type", "category"); // For multer middleware
            if (categoryData.image)
              formData.append("image", categoryData.image);

            const response = await api.put(`/categories/${id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            const { message, category } = response.data;

            // Update category in the list
            set(
              (state) => ({
                categories: state.categories.map((c) =>
                  c._id === id ? category : c
                ),
                selectedCategory:
                  state.selectedCategory?._id === id
                    ? category
                    : state.selectedCategory,
                isLoading: false,
                error: null,
              }),
              false,
              "categories/update-success"
            );

            toast.success(message || "Category updated successfully!");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to update category";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "categories/update-error"
            );

            toast.error(errorMessage);
            return false;
          }
        },

        // Delete category
        deleteCategory: async (id: string): Promise<boolean> => {
          set(
            { isLoading: true, error: null },
            false,
            "categories/delete-start"
          );

          try {
            const response = await api.delete(`/categories/${id}`);
            const { message } = response.data;

            // Remove category from the list
            set(
              (state) => ({
                categories: state.categories.filter((c) => c._id !== id),
                selectedCategory:
                  state.selectedCategory?._id === id
                    ? null
                    : state.selectedCategory,
                isLoading: false,
                error: null,
              }),
              false,
              "categories/delete-success"
            );

            toast.success(message || "Category deleted successfully!");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to delete category";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "categories/delete-error"
            );

            toast.error(errorMessage);
            return false;
          }
        },

        // UI State Management
        setSelectedCategory: (category: Category | null) => {
          set({ selectedCategory: category }, false, "categories/set-selected");
        },

        setSearchQuery: (query: string) => {
          set({ searchQuery: query }, false, "categories/set-search");
        },

        setFeaturedFilter: (filter: "all" | "featured" | "not-featured") => {
          set(
            { featuredFilter: filter },
            false,
            "categories/set-featured-filter"
          );
        },

        clearError: () => {
          set({ error: null }, false, "categories/clear-error");
        },

        reset: () => {
          set(initialState, false, "categories/reset");
        },
      };
    },
    { name: "category-store" }
  )
);

// Computed selectors
export const useFilteredCategories = () => {
  const { categories, searchQuery, featuredFilter } = useCategoryStore();

  return useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && category.featured) ||
        (featuredFilter === "not-featured" && !category.featured);

      return matchesSearch && matchesFeatured;
    });
  }, [categories, searchQuery, featuredFilter]);
};
