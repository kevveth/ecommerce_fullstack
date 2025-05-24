import { z } from "zod/v4";

// --- Role Schema ---
const roles = ["admin", "user"] as const;
export const RoleSchema = z.enum(roles).describe("User role");
export type Role = z.infer<typeof RoleSchema>;

// --- User Schema ---
export const userSchema = z
  .strictObject({
    user_id: z
      .number()
      .positive({ error: "ID must be a positive number" })
      .optional()
      .describe("User identifier"),
    username: z
      .string()
      .min(3, { error: "Username must be at least 3 characters" })
      .max(12, { error: "Username cannot exceed 12 characters" })
      .overwrite((str) => str.trim()),
    email: z
      .email({ error: "Invalid email format" })
      .overwrite((email) => email.trim().toLowerCase()),
    street_address: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    zip_code: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    role: RoleSchema,
  })
  .describe("User");
export type User = z.infer<typeof userSchema>;

// --- Profile Update Schema ---
export const profileUpdateSchema = userSchema
  .omit({ user_id: true, role: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: "At least one field must be provided for update",
    path: [],
  })
  .describe("ProfileUpdate");
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
