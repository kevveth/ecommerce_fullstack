import { z } from "zod";
import { getWithEmail } from "../services/users";

const IDSchema = z.number().positive().optional();
const RoleSchema = z.enum(["admin", "user"]);
export type Role = z.infer<typeof RoleSchema>;

// Zod schema for a complete User object

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
  role: RoleSchema
});
export type User = z.infer<typeof userSchema>;

// Zod schema for creating new users (subset of userSchema + password)
export const newUserSchema = userSchema
  .pick({
    username: true,
    email: true,
  })
  .extend({
    password: z.string().min(4, "Password must be at least 4 characters"),
  })
  .refine(async (data) => !(await checkEmailExists(data.email)), {
    message: "Email already exists",
    path: ["email"],
  });
export type NewUser = z.infer<typeof newUserSchema>;

// Asynchronous function to check if an email exists in the database
async function checkEmailExists(email: string): Promise<boolean> {
  const user = await getWithEmail(email);
  return !!user;
}

// Zod schema for updating existing users (omitting ID and password)
export const updateUserSchema = userSchema
  .omit({ user_id: true, password_hash: true })
  .partial()
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: "No fields to update",
      path: [],
    }
  );
export type UpdateableUser = z.infer<typeof updateUserSchema>;
