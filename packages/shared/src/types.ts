import { z } from "zod";

const IDSchema = z.number().positive().optional();

const RoleSchema = z.enum(["admin", "user"]);
export type Role = z.infer<typeof RoleSchema>;

export const userSchema = z.object({
  user_id: IDSchema, // Optional ID, auto-generated
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
