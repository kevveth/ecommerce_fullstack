import { z } from "zod/v4";

// Define base schemas with more specific error messages using Zod v4 syntax
const IDSchema = z
  .number()
  .positive({
    message: "ID must be a positive number",
  })
  .optional()
  .describe("User identifier");

// Define the RoleSchema using proper Zod v4 syntax - using enum values literal
const roles = ["admin", "user"] as const; // Define roles as a tuple of string literals
export const RoleSchema = z
  .enum(roles, {
    error: () => "Role must be either 'admin' or 'user'",
  })
  .describe("User role");
export type Role = z.infer<typeof RoleSchema>;

// Base user schema with refined constraints - using z.object() for better performance
export const userSchema = z.object({
  user_id: IDSchema,
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters",
    })
    .max(12, {
      message: "Username cannot exceed 12 characters",
    }),
  email: z.email({
    message: "Invalid email format",
  }),
  password_hash: z.string().nullable(), // Ensure password_hash can be null
  google_id: z.string().nullish(), // Added google_id
  street_address: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  zip_code: z.string().nullish(),
  country: z.string().nullish(),
  role: RoleSchema,
});
export type User = z.infer<typeof userSchema>;

// More specific registration schema with validations using Zod v4 syntax
export const registrationSchema = z.object({
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
    .email({
      message: "Invalid email address",
    })
    .trim()
    .toLowerCase(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  // .regex(/[A-Z]/, {
  //   message: "Password must contain at least one uppercase letter",
  // })
  // .regex(/[0-9]/, {
  //   message: "Password must contain at least one number",
  // }),
});
export type RegistrationInput = z.infer<typeof registrationSchema>;

// Login schema with better validation messages using Zod v4 syntax
export const loginSchema = z.object({
  email: z
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
