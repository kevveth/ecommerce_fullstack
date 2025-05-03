import { z } from "zod";

// Define base schemas with more specific error messages using Zod v4 syntax
const IDSchema = z
  .number({
    error: (issue) =>
      issue.input === undefined
        ? "ID is required"
        : "ID must be a positive number",
  })
  .positive()
  .optional();

// Define the RoleSchema using proper Zod v4 syntax - using literal array
const RoleSchema = z.enum(["admin", "user"], {
  message: `Role must be either "admin" or "user"`,
});
export type Role = z.infer<typeof RoleSchema>;

// Base user schema with refined constraints - using z.interface() for better performance
export const userSchema = z.interface({
  user_id: IDSchema,
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters",
    })
    .max(12, {
      message: "Username cannot exceed 12 characters",
    }),
  email: z.string().email({
    message: "Invalid email format",
  }),
  password_hash: z.string().nullable(), // Changed to nullable to support OAuth users
  street_address: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  zip_code: z.string().nullish(),
  country: z.string().nullish(),
  role: RoleSchema,
  google_id: z.string().nullish(), // Added google_id for OAuth authentication
});
export type User = z.infer<typeof userSchema>;

// More specific registration schema with validations using Zod v4 syntax
export const registrationSchema = z.interface({
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters",
    })
    .max(12, {
      message: "Username cannot exceed 12 characters",
    })
    .trim(),
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    }),
});
export type RegistrationInput = z.infer<typeof registrationSchema>;

// Login schema with better validation messages using Zod v4 syntax
export const loginSchema = z.interface({
  email: z
    .string()
    .email({
      message: "Please enter a valid email address",
    })
    .trim()
    .toLowerCase(),
  password: z.string().min(8, {
    message: "Password must contain at least 8 characters",
  }),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Optional: Profile update schema using Zod v4 refine syntax
export const profileUpdateSchema = userSchema
  .omit({ user_id: true, password_hash: true, role: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
    path: [], // Empty path means this error applies to the whole object
  });
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
