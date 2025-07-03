import { z } from "zod";

export const orderItemSchema = z.object({
  product: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be positive"),
});

export const createOrderSchema = z.object({
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters"),
  email: z.string(),
  phoneNumberOne: z
    .string()
    .min(8, "Phone number must be at least 8 characters"),
  phoneNumbertwo: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  comment: z.string().optional(),
  orderRef: z.string().min(3, "Order reference must be at least 3 characters"),
  total: z.number().min(0, "Total must be positive"),
  status: z
    .enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    .optional(),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
});

export const updateOrderSchema = createOrderSchema.partial();

export const changeStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;
export type ChangeStatusFormData = z.infer<typeof changeStatusSchema>;
