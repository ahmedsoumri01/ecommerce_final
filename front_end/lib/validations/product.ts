import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name must be less than 200 characters"),
  nameAr: z
    .string()
    .max(200, "Arabic name must be less than 200 characters")
    .optional(),
  nameFr: z
    .string()
    .max(200, "French name must be less than 200 characters")
    .optional(),
  brand: z
    .string()
    .min(1, "Brand is required")
    .min(2, "Brand must be at least 2 characters")
    .max(100, "Brand must be less than 100 characters"),
  price: z
    .number()
    .min(0.01, "Price must be greater than 0")
    .max(999999.99, "Price is too high")
    .refine(
      (val) => Number(val.toFixed(2)) === val,
      "Price can have at most 2 decimal places"
    ),
  originalPrice: z
    .number()
    .min(0, "Original price cannot be negative")
    .max(999999.99, "Original price is too high")
    .refine(
      (val) => Number(val.toFixed(2)) === val,
      "Original price can have at most 2 decimal places"
    )
    .optional(),
  category: z.string().min(1, "Category is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be less than 5000 characters"),
  descriptionAr: z
    .string()
    .max(5000, "Arabic description must be less than 5000 characters")
    .optional(),
  descriptionFr: z
    .string()
    .max(5000, "French description must be less than 5000 characters")
    .optional(),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  productRef: z
    .string()
    .min(1, "Product reference is required")
    .min(3, "Product reference must be at least 3 characters")
    .max(50, "Product reference must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Product reference can only contain letters, numbers, hyphens, and underscores"
    ),
  audience: z.enum(["public", "private"]).default("public"),
  images: z.array(z.any()).optional(),
  deliveryFee: z
    .number()
    .min(0, "Delivery fee cannot be negative")
    .max(9999, "Delivery fee is too high")
    .default(0),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name must be less than 200 characters")
    .optional(),
  nameAr: z
    .string()
    .max(200, "Arabic name must be less than 200 characters")
    .optional(),
  nameFr: z
    .string()
    .max(200, "French name must be less than 200 characters")
    .optional(),
  brand: z
    .string()
    .min(2, "Brand must be at least 2 characters")
    .max(100, "Brand must be less than 100 characters")
    .optional(),
  price: z
    .number()
    .min(0.01, "Price must be greater than 0")
    .max(999999.99, "Price is too high")
    .refine(
      (val) => Number(val.toFixed(2)) === val,
      "Price can have at most 2 decimal places"
    )
    .optional(),
  originalPrice: z
    .number()
    .min(0, "Original price cannot be negative")
    .max(999999.99, "Original price is too high")
    .refine(
      (val) => Number(val.toFixed(2)) === val,
      "Original price can have at most 2 decimal places"
    )
    .optional(),
  category: z.string().optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be less than 5000 characters")
    .optional(),
  descriptionAr: z
    .string()
    .max(5000, "Arabic description must be less than 5000 characters")
    .optional(),
  descriptionFr: z
    .string()
    .max(5000, "French description must be less than 5000 characters")
    .optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  productRef: z
    .string()
    .min(3, "Product reference must be at least 3 characters")
    .max(50, "Product reference must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Product reference can only contain letters, numbers, hyphens, and underscores"
    )
    .optional(),
  audience: z.enum(["public", "private"]).optional(),
  images: z.array(z.any()).optional(),
  deliveryFee: z
    .number()
    .min(0, "Delivery fee cannot be negative")
    .max(9999, "Delivery fee is too high")
    .optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
