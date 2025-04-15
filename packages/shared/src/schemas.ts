import { z } from "zod";

const IDSchema = z.number().positive().optional();

const RoleSchema = z.enum(["admin", "user"]);
export type Role = z.infer<typeof RoleSchema>;

export const userSchema = z.object({
  user_id: IDSchema,
  username: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  street_address: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  zip_code: z.string().nullish(),
  country: z.string().nullish(),
  role: RoleSchema,
});
export type User = z.infer<typeof userSchema>;

export const registrationSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});
