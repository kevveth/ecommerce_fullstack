import { z } from "zod";
import { getWithEmail } from "../services/users";
import {
  type User,
  type Role,
  type RegistrationInput,
  type ProfileUpdateInput,
  registrationSchema,
  profileUpdateSchema,
} from "../../../../packages/shared/dist/esm/schemas";

/**
 * Re-exports shared types for server-side use
 * @see packages/shared/src/schemas.ts
 */
export type { User, Role };

/**
 * Server-side type for new user registration
 * This is derived from the shared registration schema but represents
 * the incoming data before database persistence
 */
export type NewUser = z.infer<typeof registrationSchema>;

/**
 * Extended schema for new user creation that includes backend-specific validation
 * Checks if email already exists in database (which can't be done in shared package)
 */
export const newUserSchema = registrationSchema.refine(
  async (data: RegistrationInput) => !(await checkEmailExists(data.email)),
  {
    message: "Email already exists",
    path: ["email"],
  }
);

/**
 * Asynchronous function to check if an email exists in the database
 * This is server-specific as it requires database access
 *
 * @param email - The email to check in the database
 * @returns Promise resolving to true if email exists, false otherwise
 */
async function checkEmailExists(email: string): Promise<boolean> {
  const user = await getWithEmail(email);
  return !!user;
}

/**
 * Schema for updating existing users with server-specific validation logic
 * Extends the shared profileUpdateSchema with additional transformations
 */
export const updateUserSchema = profileUpdateSchema.pipe(
  z.transform((data: ProfileUpdateInput) => {
    // Server-specific transformations before storing
    if (data.email) data.email = data.email.toLowerCase().trim();
    if (data.username) data.username = data.username.trim();
    return data;
  })
);

export type UpdateableUser = z.infer<typeof updateUserSchema>;
