import { getWithEmail } from "../services/users.js";
import { User as SharedUser, Role } from "@ecommerce/schemas/user";

/**
 * Server-side User type extends shared User with password_hash
 */
export interface User extends SharedUser {
  password_hash: string;
}
export type { Role };

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
