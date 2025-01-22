import { pool } from "../../database/db/database";
import { QueryResult } from "pg";
import { User } from "../types/user";

// Creates a new user.
function create(user: User) {
  pool.query("INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *;", [user.username, user.email, user.password]);
}

// Retrieves a user by ID or username.
function get(id: number): Promise<QueryResult>;
function get(username: string): Promise<QueryResult>;
function get(identifier: number | string): Promise<QueryResult> {
  const query =
    typeof identifier === "number"
      ? "SELECT * FROM users WHERE user_id = $1"
      : "SELECT * FROM users WHERE username = $1";

  return pool.query(query, [identifier]);
}

// Updates a user's information.
function update(
  id: User["userId"],
  updatedUser: Partial<Omit<User, "userId" | "password">>
): Promise<QueryResult> {
  const { username, email, streetAddress, city, state, zipCode, country } =
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

  return pool.query(query, [...updateValues, id]);
}

// Removes a user from the database.
function remove(id: User["userId"]) {
  pool.query("DELETE FROM users WHERE user_id = ?", [id]);
}


const users = {
  create,
  get,
  update,
  remove
};


export default users;
