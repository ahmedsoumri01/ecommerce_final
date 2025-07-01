import { create } from "zustand";
import { devtools } from "zustand/middleware";
import api from "@/app/api/axios";
import { toast } from "sonner";

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
  _id?: string;
}

export interface Order {
  _id: string;
  customerName: string;
  email: string;
  phoneNumberOne: string;
  phoneNumbertwo?: string;
  address: string;
  city: string;
  state?: string;
  comment?: string;
  orderRef: string;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  orderDate: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  customerName: string;
  email: string;
  phoneNumberOne: string;
  phoneNumbertwo?: string;
  address: string;
  city: string;
  state?: string;
  comment?: string;
  orderRef: string;
  total: number;
  status?: string;
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
}

export interface UpdateOrderData extends Partial<CreateOrderData> {}

interface OrderStore {
  orders: Order[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  statusFilter: string;
  confirmingOrders: boolean;
  confirmError: string | null;
  // Actions
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<Order | null>;
  fetchOrderByReference: (orderRef: string) => Promise<Order | null>;
  createOrder: (data: CreateOrderData) => Promise<boolean>;
  updateOrder: (id: string, data: UpdateOrderData) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
  changeOrderStatus: (id: string, status: string) => Promise<boolean>;
  cancelOrder: (id: string) => Promise<boolean>;
  confirmOrders: (orderIds: string[]) => Promise<boolean>;

  // Filters
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;

  // Computed
  filteredOrders: () => Order[];
  getOrderStats: () => {
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

export const useOrderStore = create<OrderStore>()(
  devtools(
    (set, get) => ({
      orders: [],
      loading: false,
      error: null,
      searchTerm: "",
      statusFilter: "all",

      fetchOrders: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get("/orders");
          set({ orders: response.data, loading: false });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to fetch orders";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
        }
      },

      fetchOrderById: async (id: string) => {
        try {
          const response = await api.get(`/orders/${id}`);
          return response.data;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to fetch order";
          toast.error(errorMessage);
          return null;
        }
      },
      confirmOrders: async (orderIds) => {
        set({ confirmingOrders: true, confirmError: null });

        try {
          const response = await api.put("/orders/confirm-multiple", {
            orderIds,
          });
          const updatedCount = response.data.updatedOrderCount;

          // Update local store
          set((state) => ({
            orders: state.orders.map((order) =>
              orderIds.includes(order._id)
                ? { ...order, status: "confirmed" }
                : order
            ),
            confirmingOrders: false,
          }));

          toast.success(`${updatedCount} order(s) confirmed successfully`);
          return true;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to confirm orders";
          set({ confirmError: errorMessage, confirmingOrders: false });
          toast.error(errorMessage);
          return false;
        }
      },
      fetchOrderByReference: async (orderRef: string) => {
        try {
          const response = await api.get(`/orders/reference/${orderRef}`);
          return response.data;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to fetch order";
          toast.error(errorMessage);
          return null;
        }
      },

      createOrder: async (data: CreateOrderData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post("/orders/create", data);
          const newOrder = response.data.order;
          set((state) => ({
            orders: [newOrder, ...state.orders],
            loading: false,
          }));
          toast.success("Order created successfully");
          return true;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to create order";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      updateOrder: async (id: string, data: UpdateOrderData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.put(`/orders/${id}`, data);
          const updatedOrder = response.data.order;
          set((state) => ({
            orders: state.orders.map((order) =>
              order._id === id ? updatedOrder : order
            ),
            loading: false,
          }));
          toast.success("Order updated successfully");
          return true;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to update order";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      deleteOrder: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await api.delete(`/orders/${id}`);
          set((state) => ({
            orders: state.orders.filter((order) => order._id !== id),
            loading: false,
          }));
          toast.success("Order deleted successfully");
          return true;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to delete order";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      changeOrderStatus: async (id: string, status: string) => {
        try {
          const response = await api.put(`/orders/status/${id}`, { status });
          const updatedOrder = response.data.order;
          set((state) => ({
            orders: state.orders.map((order) =>
              order._id === id ? updatedOrder : order
            ),
          }));
          toast.success("Order status updated successfully");
          return true;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to update order status";
          toast.error(errorMessage);
          return false;
        }
      },

      cancelOrder: async (id: string) => {
        try {
          const response = await api.put(`/orders/cancel/${id}`);
          const updatedOrder = response.data.order;
          set((state) => ({
            orders: state.orders.map((order) =>
              order._id === id ? updatedOrder : order
            ),
          }));
          toast.success("Order cancelled successfully");
          return true;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to cancel order";
          toast.error(errorMessage);
          return false;
        }
      },

      setSearchTerm: (term: string) => set({ searchTerm: term }),
      setStatusFilter: (status: string) => set({ statusFilter: status }),

      filteredOrders: () => {
        const { orders, searchTerm, statusFilter } = get();
        return orders.filter((order) => {
          const matchesSearch =
            searchTerm === "" ||
            order.customerName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderRef.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesStatus =
            statusFilter === "all" || order.status === statusFilter;

          return matchesSearch && matchesStatus;
        });
      },

      getOrderStats: () => {
        const { orders } = get();
        return {
          total: orders.length,
          pending: orders.filter((o) => o.status === "pending").length,
          confirmed: orders.filter((o) => o.status === "confirmed").length,
          shipped: orders.filter((o) => o.status === "shipped").length,
          delivered: orders.filter((o) => o.status === "delivered").length,
          cancelled: orders.filter((o) => o.status === "cancelled").length,
        };
      },
    }),
    { name: "order-store" }
  )
);
