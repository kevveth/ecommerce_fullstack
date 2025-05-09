import * as db from "../database/database";
import { User, UpdateableUser } from "../models/user.model";

/**
 * Creates a new user in the database
 *
 * @param userData - User data to create (username, email, password hash)
 * @returns The created user record
 */
export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
}): Promise<User> {
  const { username, email, password } = userData;

  const query = `
    INSERT INTO users (username, email, password) 
    VALUES ($1, $2, $3) 
    RETURNING *
  `;

  const result = await db.query(query, [username, email, password]);
  return result.rows[0];
}

export async function getAll(): Promise<User[]> {
  const query = "SELECT * FROM users";
  const result = await db.query(query);

  return result.rows;
}

// Retrieves a user by ID
export async function getWithId(id: User["user_id"]): Promise<User | null> {
  const query = "SELECT * FROM users WHERE user_id = $1";
  const result = await db.query(query, [id]);

  return result.rows[0] || null;
}

export async function getWithUsername(
  username: User["username"]
): Promise<User | null> {
  const query = "SELECT * FROM users WHERE username = $1";
  const result = await db.query(query, [username]);

  return result.rows[0] || null;
}

export async function getWithEmail(email: User["email"]): Promise<User | null> {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await db.query(query, [email]);

  return result.rows[0] || null;
}

// Updates a user's information.
export async function update(
  id: User["user_id"],
  properties: UpdateableUser
): Promise<User> {
  // Add validation to ensure `properties` is not empty
  if (Object.keys(properties).length === 0) {
    throw new Error("At least one field must be provided for update.");
  }

  const setClauses: string[] = [];
  const updateValues: string[] = []; // Array to hold the values for the SQL query
  let index = 1; // Index for parameter placeholders in the query

  // Iterates through the key-value pairs of the 'properties' object.
  Object.entries(properties).forEach(([key, value]) => {
    // Build the SET clause dynamically using Object.entries for conciseness
    setClauses.push(`${key} = $${index}`);
    // Ensure a valid string is passed to `updateValues`
    updateValues.push(value ? String(value) : "");

    index++; // Increment the index for the next placeholder
  });

  //! Zod now handles the empty update object in the controller
  //// Handle case where no values to update
  //// if (setClauses.length === 0) {
  ////   throw new BadRequestError({
  ////     message: "No values to update",
  ////     logging: true,
  ////   });
  //// }

  // Build the SQL query dynamically
  const query = `UPDATE users SET ${setClauses.join(
    ", "
  )} WHERE user_id = $${index} RETURNING *;`;

  // Execute the SQL query using the database connection
  const result = await db.query(query, [...updateValues, id]);

  return result.rows[0];
}

// Ensure the correct type is passed to the function
// Replace `{}` with a valid string argument where the error occurs.

// Removes a user from the database.
export async function remove(id: User["user_id"]): Promise<User> {
  const query = "DELETE FROM users WHERE user_id = $1 RETURNING *;";
  const result = await db.query(query, [id]);
  return result.rows[0];
}
