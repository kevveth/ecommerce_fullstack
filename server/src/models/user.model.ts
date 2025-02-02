import { z } from "zod";
import { getWithEmail } from "../services/users";

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

export const newUserSchema = userSchema
  .pick({
    username: true,
    email: true,
  })
  .extend({
    password: z.string(),
  })
  .refine(
    async (data) => {
      const emailExists = await checkEmailExists(data.email);
      return !emailExists;
    },
    {
      message: "Email already exists",
      path: ["email"],
    }
  );
export type NewUser = z.infer<typeof newUserSchema>;

async function checkEmailExists(email: string): Promise<Boolean> {
  const user = await getWithEmail(email);
  return !!user;
}

export const updateUserSchema = userSchema
  .omit({ user_id: true, password_hash: true })
  .partial();
export type UpdateableUser = z.infer<typeof updateUserSchema>;
