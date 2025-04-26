import { z } from "zod";

// Define base schemas with more specific error messages
const IDSchema = z.number().positive("ID must be a positive number").optional();

const RoleSchema = z.enum(["admin", "user"], {
  errorMap: (issue, ctx) => {
    return { message: `Role must be either "admin" or "user"` };
  },
});
export type Role = z.infer<typeof RoleSchema>;

// Base user schema with refined constraints
export const userSchema = z.object({
  user_id: IDSchema,
  username: z.string().min(4, "Username must be at least 4 characters"),
  email: z.string().email("Invalid email format"),
  password_hash: z.string(),
  street_address: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  zip_code: z.string().nullish(),
  country: z.string().nullish(),
  role: RoleSchema,
});
export type User = z.infer<typeof userSchema>;

// More specific registration schema with validations
export const registrationSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(50, "Username cannot exceed 50 characters")
    .trim(),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});
export type RegistrationInput = z.infer<typeof registrationSchema>;

// Login schema with better validation messages
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Optional: Profile update schema
export const profileUpdateSchema = userSchema
  .omit({ user_id: true, password_hash: true, role: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
