import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must be less than 100 characters"),
  nameAr: z
    .string()
    .max(100, "Arabic name must be less than 100 characters")
    .optional(),
  nameFr: z
    .string()
    .max(100, "French name must be less than 100 characters")
    .optional(),
  icon: z.string().optional(),
  featured: z.boolean().default(false),
  image: z.any().optional(),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must be less than 100 characters")
    .optional(),
  nameAr: z
    .string()
    .max(100, "Arabic name must be less than 100 characters")
    .optional(),
  nameFr: z
    .string()
    .max(100, "French name must be less than 100 characters")
    .optional(),
  icon: z.string().optional(),
  featured: z.boolean().optional(),
  image: z.any().optional(),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
