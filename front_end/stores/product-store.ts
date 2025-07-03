import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "sonner";
import api from "@/app/api/axios";
import type { AxiosError } from "axios";
import { subscribeToReset } from "@/lib/store-reset";

export interface Product {
  _id: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  description: string;
  descriptionAr?: string;
  descriptionFr?: string;
  inStock: boolean;
  featured: boolean;
  productRef: string;
  audience: "public" | "private";
  createdAt: string;
  updatedAt: string;
  deliveryFee?: number;
}

export interface CreateProductData {
  name: string;
  nameAr?: string;
  nameFr?: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  descriptionAr?: string;
  descriptionFr?: string;
  inStock: boolean;
  featured: boolean;
  productRef: string;
  audience: "public" | "private";
  images?: File[];
  deliveryFee?: number;
}

export interface UpdateProductData {
  name?: string;
  nameAr?: string;
  nameFr?: string;
  brand?: string;
  price?: number;
  originalPrice?: number;
  category?: string;
  description?: string;
  descriptionAr?: string;
  descriptionFr?: string;
  inStock?: boolean;
  featured?: boolean;
  productRef?: string;
  audience?: "public" | "private";
  images?: File[];
  deliveryFee?: number;
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  categoryFilter: string;
  stockFilter: "all" | "in-stock" | "out-of-stock";
  featuredFilter: "all" | "featured" | "not-featured";
  audienceFilter: "all" | "public" | "private";
}

export interface ProductActions {
  // CRUD Operations
  getAllProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<Product | null>;
  createProduct: (productData: CreateProductData) => Promise<boolean>;
  updateProduct: (
    id: string,
    productData: UpdateProductData
  ) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleVisibility: (
    id: string,
    audience: "public" | "private"
  ) => Promise<boolean>;
  toggleStock: (id: string, inStock: boolean) => Promise<boolean>;

  // UI State Management
  setSelectedProduct: (product: Product | null) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setStockFilter: (filter: "all" | "in-stock" | "out-of-stock") => void;
  setFeaturedFilter: (filter: "all" | "featured" | "not-featured") => void;
  setAudienceFilter: (filter: "all" | "public" | "private") => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  categoryFilter: "all",
  stockFilter: "all",
  featuredFilter: "all",
  audienceFilter: "all",
};

export const useProductStore = create<ProductState & ProductActions>()(
  devtools(
    (set, get) => {
      // Subscribe to store reset
      subscribeToReset(() => {
        set(initialState, false, "products/reset");
      });

      return {
        ...initialState,

        // Get all products
        getAllProducts: async () => {
          set(
            { isLoading: true, error: null },
            false,
            "products/get-all-start"
          );

          try {
            const response = await api.get("/products");
            const products = response.data;

            set(
              {
                products,
                isLoading: false,
                error: null,
              },
              false,
              "products/get-all-success"
            );
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to fetch products";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "products/get-all-error"
            );

            toast.error(errorMessage);
          }
        },

        // Get product by ID
        getProductById: async (id: string): Promise<Product | null> => {
          try {
            const response = await api.get(`/products/${id}`);
            const product = response.data;

            set(
              { selectedProduct: product },
              false,
              "products/get-by-id-success"
            );
            return product;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to fetch product";

            set({ error: errorMessage }, false, "products/get-by-id-error");
            toast.error(errorMessage);
            return null;
          }
        },

        // Create product
        createProduct: async (
          productData: CreateProductData
        ): Promise<boolean> => {
          set({ isLoading: true, error: null }, false, "products/create-start");

          try {
            const formData = new FormData();
            formData.append("name", productData.name);
            if (productData.nameAr)
              formData.append("nameAr", productData.nameAr);
            if (productData.nameFr)
              formData.append("nameFr", productData.nameFr);
            formData.append("brand", productData.brand);
            formData.append("price", productData.price.toString());
            if (productData.originalPrice)
              formData.append(
                "originalPrice",
                productData.originalPrice.toString()
              );
            formData.append("category", productData.category);
            formData.append("description", productData.description);
            if (productData.descriptionAr)
              formData.append("descriptionAr", productData.descriptionAr);
            if (productData.descriptionFr)
              formData.append("descriptionFr", productData.descriptionFr);
            formData.append("inStock", productData.inStock.toString());
            formData.append("featured", productData.featured.toString());
            formData.append("productRef", productData.productRef);
            formData.append("audience", productData.audience);
            if (productData.deliveryFee !== undefined)
              formData.append("deliveryFee", productData.deliveryFee.toString());

            // Add images
            if (productData.images) {
              productData.images.forEach((image) => {
                formData.append("images", image);
              });
            }

            const response = await api.post("/products/create", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            const { message, product } = response.data;

            // Add new product to the list
            set(
              (state) => ({
                products: [product, ...state.products],
                isLoading: false,
                error: null,
              }),
              false,
              "products/create-success"
            );

            toast.success(message || "Product created successfully!");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to create product";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "products/create-error"
            );

            toast.error(errorMessage);
            return false;
          }
        },

        // Update product
        updateProduct: async (
          id: string,
          productData: UpdateProductData
        ): Promise<boolean> => {
          set({ isLoading: true, error: null }, false, "products/update-start");

          try {
            const formData = new FormData();
            if (productData.name) formData.append("name", productData.name);
            if (productData.nameAr !== undefined)
              formData.append("nameAr", productData.nameAr);
            if (productData.nameFr !== undefined)
              formData.append("nameFr", productData.nameFr);
            if (productData.brand) formData.append("brand", productData.brand);
            if (productData.price !== undefined)
              formData.append("price", productData.price.toString());
            if (productData.originalPrice !== undefined)
              formData.append(
                "originalPrice",
                productData.originalPrice.toString()
              );
            if (productData.category)
              formData.append("category", productData.category);
            if (productData.description)
              formData.append("description", productData.description);
            if (productData.descriptionAr !== undefined)
              formData.append("descriptionAr", productData.descriptionAr);
            if (productData.descriptionFr !== undefined)
              formData.append("descriptionFr", productData.descriptionFr);
            if (productData.inStock !== undefined)
              formData.append("inStock", productData.inStock.toString());
            if (productData.featured !== undefined)
              formData.append("featured", productData.featured.toString());
            if (productData.productRef)
              formData.append("productRef", productData.productRef);
            if (productData.audience)
              formData.append("audience", productData.audience);
            if (productData.deliveryFee !== undefined)
              formData.append("deliveryFee", productData.deliveryFee.toString());

            // Add images if provided
            if (productData.images) {
              productData.images.forEach((image) => {
                formData.append("images", image);
              });
            }

            const response = await api.put(`/products/${id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            const { message, product } = response.data;

            // Update product in the list
            set(
              (state) => ({
                products: state.products.map((p) =>
                  p._id === id ? product : p
                ),
                selectedProduct:
                  state.selectedProduct?._id === id
                    ? product
                    : state.selectedProduct,
                isLoading: false,
                error: null,
              }),
              false,
              "products/update-success"
            );

            toast.success(message || "Product updated successfully!");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to update product";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "products/update-error"
            );

            toast.error(errorMessage);
            return false;
          }
        },

        // Delete product
        deleteProduct: async (id: string): Promise<boolean> => {
          set({ isLoading: true, error: null }, false, "products/delete-start");

          try {
            const response = await api.delete(`/products/${id}`);
            const { message } = response.data;

            // Remove product from the list
            set(
              (state) => ({
                products: state.products.filter((p) => p._id !== id),
                selectedProduct:
                  state.selectedProduct?._id === id
                    ? null
                    : state.selectedProduct,
                isLoading: false,
                error: null,
              }),
              false,
              "products/delete-success"
            );

            toast.success(message || "Product deleted successfully!");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message || "Failed to delete product";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "products/delete-error"
            );

            toast.error(errorMessage);
            return false;
          }
        },

        // Toggle visibility
        toggleVisibility: async (
          id: string,
          audience: "public" | "private"
        ): Promise<boolean> => {
          set(
            { isLoading: true, error: null },
            false,
            "products/toggle-visibility-start"
          );

          try {
            const response = await api.put(
              `/products/toggle-visibility/${id}`,
              { audience }
            );
            const { message, product } = response.data;

            // Update product in the list
            set(
              (state) => ({
                products: state.products.map((p) =>
                  p._id === id ? product : p
                ),
                selectedProduct:
                  state.selectedProduct?._id === id
                    ? product
                    : state.selectedProduct,
                isLoading: false,
                error: null,
              }),
              false,
              "products/toggle-visibility-success"
            );

            toast.success(message || "Product visibility updated!");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message ||
              "Failed to update visibility";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "products/toggle-visibility-error"
            );

            toast.error(errorMessage);
            return false;
          }
        },

        // Toggle stock
        toggleStock: async (id: string, inStock: boolean): Promise<boolean> => {
          set(
            { isLoading: true, error: null },
            false,
            "products/toggle-stock-start"
          );

          try {
            const response = await api.put(`/products/toggle-stock/${id}`, {
              inStock: inStock.toString(),
            });
            const { message, product } = response.data;

            // Update product in the list
            set(
              (state) => ({
                products: state.products.map((p) =>
                  p._id === id ? product : p
                ),
                selectedProduct:
                  state.selectedProduct?._id === id
                    ? product
                    : state.selectedProduct,
                isLoading: false,
                error: null,
              }),
              false,
              "products/toggle-stock-success"
            );

            toast.success(message || "Stock status updated!");
            return true;
          } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError.response?.data?.message ||
              "Failed to update stock status";

            set(
              {
                error: errorMessage,
                isLoading: false,
              },
              false,
              "products/toggle-stock-error"
            );

            toast.error(errorMessage);
            return false;
          }
        },

        // UI State Management
        setSelectedProduct: (product: Product | null) => {
          set({ selectedProduct: product }, false, "products/set-selected");
        },

        setSearchQuery: (query: string) => {
          set({ searchQuery: query }, false, "products/set-search");
        },

        setCategoryFilter: (category: string) => {
          set(
            { categoryFilter: category },
            false,
            "products/set-category-filter"
          );
        },

        setStockFilter: (filter: "all" | "in-stock" | "out-of-stock") => {
          set({ stockFilter: filter }, false, "products/set-stock-filter");
        },

        setFeaturedFilter: (filter: "all" | "featured" | "not-featured") => {
          set(
            { featuredFilter: filter },
            false,
            "products/set-featured-filter"
          );
        },

        setAudienceFilter: (filter: "all" | "public" | "private") => {
          set(
            { audienceFilter: filter },
            false,
            "products/set-audience-filter"
          );
        },

        clearError: () => {
          set({ error: null }, false, "products/clear-error");
        },

        reset: () => {
          set(initialState, false, "products/reset");
        },
      };
    },
    { name: "product-store" }
  )
);

// Computed selectors
export const useFilteredProducts = () => {
  const {
    products,
    searchQuery,
    categoryFilter,
    stockFilter,
    featuredFilter,
    audienceFilter,
  } = useProductStore();

  return products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productRef.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.category._id === categoryFilter;

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "in-stock" && product.inStock) ||
      (stockFilter === "out-of-stock" && !product.inStock);

    const matchesFeatured =
      featuredFilter === "all" ||
      (featuredFilter === "featured" && product.featured) ||
      (featuredFilter === "not-featured" && !product.featured);

    const matchesAudience =
      audienceFilter === "all" || product.audience === audienceFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStock &&
      matchesFeatured &&
      matchesAudience
    );
  });
};
