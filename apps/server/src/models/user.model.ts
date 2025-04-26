import { z } from "zod";
import { getWithEmail } from "../services/users";
import { userSchema, registrationSchema } from "@repo/shared/schemas";

// Import the base types from shared schemas to keep consistency
export type User = z.infer<typeof userSchema>;
export type Role = z.infer<typeof userSchema.shape.role>;

// Define NewUser type for registration
export type NewUser = {
  username: string;
  email: string;
  password: string;
};

// Server-specific schemas that extend the shared schemas

// Extended schema for new user creation that includes backend-specific logic
export const newUserSchema = registrationSchema.refine(
  async (data) => !(await checkEmailExists(data.email)),
  {
    message: "Email already exists",
    path: ["email"],
  }
);

// Asynchronous function to check if an email exists in the database
async function checkEmailExists(email: string): Promise<boolean> {
  const user = await getWithEmail(email);
  return !!user;
}

// Schema for updating existing users with improved validation logic
export const updateUserSchema = userSchema
  .omit({ user_id: true, password_hash: true })
  .partial()
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: "At least one field must be provided for update",
      path: [],
    }
  )
  .transform((data) => {
    // Optional: transform data before storing, like trimming strings
    if (data.email) data.email = data.email.toLowerCase().trim();
    if (data.username) data.username = data.username.trim();
    return data;
  });

export type UpdateableUser = z.infer<typeof updateUserSchema>;
