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

// Retrieves a user by ID
export async function get(id: User["user_id"]): Promise<UserResult> {
  const query = "SELECT * FROM users WHERE user_id = $1";
  const result = await db.query(query, [id]);

  return {
    query,
    user: result.rows[0],
  };
}

export async function getWithEmail(email: User["email"]): Promise<UserResult> {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await db.query(query, [email]);

  return {
    query,
    user: result.rows[0],
  };
}

// Updates a user's information.
type UpdateableUser = Partial<Omit<User, "user_id" | "password_hash">>;
export async function update(
  id: User["user_id"],
  properties: UpdateableUser
): Promise<UserResult> {
  const setClauses: string[] = [];
  const updateValues: (string | number)[] = []; // Array to hold the values for the SQL query
  let index = 1; // Index for parameter placeholders in the query

  //Iterates through the key-value pairs of the 'properties' object.
  Object.entries(properties).forEach(([key, value]) => {
    //Build the SET clause dynamically using Object.entries for conciseness
    setClauses.push(`${key} = $${index}`);
    updateValues.push(value); // Add the value to the updateValues array
    index++; // Increment the index for the next placeholder
  });

  //Handle case where no values to update
  if (setClauses.length === 0) {
    return { query: "", user: undefined };
  }

  // Build the SQL query dynamically
  const query = `UPDATE users SET ${setClauses.join(
    ", "
  )} WHERE user_id = $${index} RETURNING *;`;
  console.log(query); // Log the query for debugging

  // Execute the SQL query using the database connection
  const result = await db.query(query, [...updateValues, id]);

  return { query, user: result.rows[0] };
}

// Removes a user from the database.
export async function remove(id: User["user_id"]): Promise<UserResult> {
  const query = "DELETE FROM users WHERE user_id = $1 RETURNING *;";
  const result = await db.query(query, [id]);
  return { query, user: result.rows[0] };
}
