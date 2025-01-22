import { pool } from "../../database/db/database";
import { QueryResult } from "pg";
import { User, UserOptions } from "../types/user";

function create(user: User): Promise<QueryResult> {
  const query =
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *;";
  return pool.query(query, [user.username, user.email, user.password]);
}

// Overload function definitions for getting a user by ID or username
function get(id: number): Promise<QueryResult>; // Function signature for getting a user by ID
function get(username: string): Promise<QueryResult>; // Function signature for getting a user by username
function get(identifier: number | string): Promise<QueryResult> {
  // Implementation of the overloaded get function
  // Determine the query based on the type of identifier
  const query =
    typeof identifier === "number"
      ? "SELECT * FROM users WHERE user_id = $1" // SQL query to select a user by ID
      : "SELECT * FROM users WHERE username = $1"; // SQL query to select a user by username

  // Execute the query with the provided identifier
  return pool.query(query, [identifier]);
}

function update(
  userId: User["userId"],
  updatedUser: Partial<Omit<User, "userId" | "password">>
): Promise<QueryResult> {
  const { username, email, streetAddress, city, state, zipCode, country } =
    updatedUser;

  const setClauses: string[] = [];
  const updateValues: string[] = [];

  if (username) {
    setClauses.push("username = ?");
    updateValues.push(username);
  }

  if (email) {
    setClauses.push("email = ?");
    updateValues.push(email);
  }

  if (streetAddress) {
    setClauses.push("street_address = ?");
    updateValues.push(streetAddress);
  }

  if (city) {
    setClauses.push("city = ?");
    updateValues.push(city);
  }

  if (state) {
    setClauses.push("state = ?");
    updateValues.push(state);
  }

  if (zipCode) {
    setClauses.push("zip_code = ?");
    updateValues.push(zipCode);
  }

  if (country) {
    setClauses.push("country = ?");
    updateValues.push(country);
  }

  const query = `UPDATE users SET ${setClauses.join(
    ", "
  )} WHERE user_id = ? RETURNING *`;

  return pool.query(query, [...updateValues, userId]); // Use userId here
}

// users object containing the get function
const users = {
  get,
  create,
  update,
};

// Export the users object as the default export
export default users;
