import { User } from "../models/user.model.js";
import * as db from "../database/database.js";

/**
 * Creates a new user in the database
 */
export async function createUser(userData: {
  username: string;
  email: string;
  password_hash: string;
}): Promise<User> {
  const { username, email, password_hash } = userData;
  const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await db.query(query, [username, email, password_hash]);
  return result.rows[0];
}

/**
 * Retrieves all users
 */
export async function getAll(): Promise<User[]> {
  const query = "SELECT * FROM users";
  const result = await db.query(query);
  return result.rows;
}

/**
 * Retrieves a user by ID
 */
export async function getWithId(id: number): Promise<User | null> {
  const query = "SELECT * FROM users WHERE user_id = $1";
  const result = await db.query(query, [id]);
  return result.rows[0] || null;
}

/**
 * Retrieves a user by username
 */
export async function getWithUsername(username: string): Promise<User | null> {
  const query = "SELECT * FROM users WHERE username = $1";
  const result = await db.query(query, [username]);
  return result.rows[0] || null;
}

/**
 * Retrieves a user by email
 */
export async function getWithEmail(email: string): Promise<User | null> {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await db.query(query, [email]);
  return result.rows[0] || null;
}

/**
 * Updates a user's information
 */
export async function update(
  id: number,
  properties: Partial<Omit<User, "user_id">>
): Promise<User> {
  if (Object.keys(properties).length === 0) {
    throw new Error("At least one field must be provided for update.");
  }
  const setClauses: string[] = [];
  const updateValues: any[] = [];
  let index = 1;
  for (const [key, value] of Object.entries(properties)) {
    setClauses.push(`${key} = $${index}`);
    updateValues.push(value);
    index++;
  }
  const query = `UPDATE users SET ${setClauses.join(", ")} WHERE user_id = $${index} RETURNING *`;
  updateValues.push(id);
  const result = await db.query(query, updateValues);
  return result.rows[0];
}

/**
 * Removes a user by ID
 */
export async function remove(id: number): Promise<void> {
  const query = "DELETE FROM users WHERE user_id = $1";
  await db.query(query, [id]);
}
