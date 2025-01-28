import * as db from "../database/database";
import { User } from "../types/user";

interface CreateUserDTO {
  username: string;
  email: string;
  password_hash: string;
}

export interface UserResult {
  query: string;
  user?: User;
}

// Creates a new user.
export async function create(credentials: CreateUserDTO): Promise<UserResult> {
  const query =
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id;";
  console.log(query);
  const result = await db.query(query, [
    credentials.username,
    credentials.email,
    credentials.password_hash,
  ]);

  return { query, user: result.rows[0] };
}

// Retrieves a user by ID or username.
export async function get(id: User["user_id"]): Promise<UserResult> {
  const query = "SELECT * FROM users WHERE user_id = $1";
  const result = await db.query(query, [id]);

  return {
    query,
    user: result.rows[0],
  };
}

// Updates a user's information.
export async function update(
  id: User["user_id"],
  values: Partial<Omit<User, "user_id" | "password_hash">>
): Promise<UserResult> {
  const { username, email, street_address, city, state, zip_code, country } =
    values;

  const setClauses: string[] = [];
  const updateValues: string[] = []; 
  let index = 1;

  if (username) {
    setClauses.push(`username = $${index}`);
    updateValues.push(username);
    index++;
  }

  if (email) {
    setClauses.push(`email = $${index}`);
    updateValues.push(email);
    index++;
  }

  if (street_address) {
    setClauses.push(`street_address = $${index}`);
    updateValues.push(street_address);
    index++;
  }

  if (city) {
    setClauses.push(`city = $${index}`);
    updateValues.push(city);
    index++;
  }

  if (state) {
    setClauses.push(`state = $${index}`);
    updateValues.push(state);
    index++;
  }

  if (zip_code) {
    setClauses.push(`zip_code = $${index}`);
    updateValues.push(zip_code);
    index++;
  }

  if (country) {
    setClauses.push(`country = $${index}`);
    updateValues.push(country);
    index++;
  }

  const query = `UPDATE users SET ${setClauses.join(
    ", "
  )} WHERE user_id = $${index} RETURNING *;`;
  console.log(query);

  const result = await db.query(query, [...updateValues, id]);

  return {
    query,
    user: result.rows[0],
  };
}

// Removes a user from the database.
export async function remove(id: User["user_id"]): Promise<UserResult> {
  const query = "DELETE FROM users WHERE user_id = $1 RETURNING *;";
  const result = await db.query(query, [id]);
  return { query, user: result.rows[0] };
}
