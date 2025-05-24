import { z } from "zod/v4";

/**
 * Common parameter validation schemas
 * Centralized location for reusable parameter validations
 */

// ID parameter validation
export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^[1-9]\d*$/, { message: "ID must be a positive integer" })
    .transform((str) => parseInt(str, 10)),
});

// Username parameter validation
export const usernameParamSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username cannot be empty" })
    .max(50, { message: "Username cannot exceed 50 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        "Username can only contain letters, numbers, underscores, and hyphens",
    }),
});

// Common query parameters
export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((str) => (str ? parseInt(str, 10) : 1))
    .refine((num) => num > 0, { message: "Page must be greater than 0" }),
  limit: z
    .string()
    .optional()
    .transform((str) => (str ? parseInt(str, 10) : 10))
    .refine((num) => num > 0 && num <= 100, {
      message: "Limit must be between 1 and 100",
    }),
});

// Search query schema
export const searchQuerySchema = z.object({
  q: z.string().min(1, { message: "Search query cannot be empty" }).optional(),
  ...paginationQuerySchema.shape,
});
