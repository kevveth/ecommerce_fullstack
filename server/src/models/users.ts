import * as db from "../database/database";
import { User } from "../types/user";

// Creates a new user.
export async function create(user: User): Promise<User["user_id"]> {
  const result = await db.query("INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id;", [user.username, user.email, user.password_hash]);

  return result.rows[0];
}

// Retrieves a user by ID or username.
export async function get(id: number): Promise<User>;
export async function get(username: string): Promise<User>;
export async function get(identifier: number | string): Promise<User> {
  const query =
    typeof identifier === "number"
      ? "SELECT * FROM users WHERE user_id = $1"
      : "SELECT * FROM users WHERE username = $1";

  const result = await db.query(query, [identifier]);
  return result.rows[0];
}

// Updates a user's information.
export async function update(
  id: User["user_id"],
  updatedUser: Partial<Omit<User, "userId" | "password">>
): Promise<User> {
  const { username, email, street_address, city, state, zip_code, country } =
    updatedUser;

  const setClauses: string[] = [];
  const updateValues: any[] = []; // Use any[] to allow various data types


  if (username) {
    setClauses.push("username = ?");
    updateValues.push(username);
  }

  if (email) {
    setClauses.push("email = ?");
    updateValues.push(email);
  }

  if (street_address) {
    setClauses.push("street_address = ?");
    updateValues.push(street_address);
  }

  if (city) {
    setClauses.push("city = ?");
    updateValues.push(city);
  }

  if (state) {
    setClauses.push("state = ?");
    updateValues.push(state);
  }

  if (zip_code) {
    setClauses.push("zip_code = ?");
    updateValues.push(zip_code);
  }

  if (country) {
    setClauses.push("country = ?");
    updateValues.push(country);
  }


  const query = `UPDATE users SET ${setClauses.join(
    ", "
  )} WHERE user_id = ? RETURNING *`;

  const result = await db.query(query, [...updateValues, id]);
  return result.rows[0];
}

// Removes a user from the database.
export async function remove(id: User["user_id"]) {
  const result = await db.query("DELETE FROM users WHERE user_id = ?", [id]);
  return result;
}
