import { z } from "zod";

export const userSchema = z.object({
  user_id: z.number().int().optional(),
  username: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.number().int().optional(),
  country: z.string().optional(),
});
export type User = z.infer<typeof userSchema>;

export const newUserSchema = userSchema.pick({
  username: true,
  email: true,
  password_hash: true,
});
export type NewUser = z.infer<typeof newUserSchema>;


export const updateUserSchema = userSchema
  .omit({ user_id: true, password_hash: true })
  .partial()
export type UpdateableUser = z.infer<typeof updateUserSchema>;
