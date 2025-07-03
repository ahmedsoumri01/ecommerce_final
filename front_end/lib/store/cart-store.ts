import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/stores/product-store";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getOrderDeliveryFee: () => number; // <-- Add this line
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.product._id === product._id
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }

        // Auto-open cart when item is added
        set({ isOpen: true });
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.product._id !== productId),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      toggleCart: () => set({ isOpen: !get().isOpen }),

      setCartOpen: (open: boolean) => set({ isOpen: open }),

      getOrderDeliveryFee: () => {
        const items = get().items;
        if (items.length === 0) return 0;
        // If any product has deliveryFee 0, order delivery fee is 0
        if (
          items.some(
            (item) =>
              !item.product.deliveryFee || item.product.deliveryFee === 0
          )
        ) {
          return 0;
        }
        // If all products have the same deliveryFee, return that fee
        const uniqueFees = Array.from(
          new Set(items.map((item) => item.product.deliveryFee))
        );
        if (uniqueFees.length === 1) {
          return uniqueFees[0] || 0;
        }
        // If multiple non-zero delivery fees, return 7
        return 7;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
