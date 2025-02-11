import * as db from "../database/database";
import { User, UpdateableUser } from "../models/user.model";

export async function getAll(): Promise<User[]> {
  const query = "SELECT * FROM users";
  const result = await db.query(query);

  return result.rows;
}

// Retrieves a user by ID
export async function get(id: User["user_id"]): Promise<User> {
  const query = "SELECT * FROM users WHERE user_id = $1";
  const result = await db.query(query, [id]);

  return result.rows[0];
}

export async function getWithUsername(username: User["username"]): Promise<User> {
  const query = "SELECT * FROM users WHERE username = $1";
  const result = await db.query(query, [username]);

  return result.rows[0];
}

export async function getWithEmail(email: User["email"]): Promise<User> {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await db.query(query, [email]);

  return result.rows[0];
}

// Updates a user's information.
export async function update(
  id: User["user_id"],
  properties: UpdateableUser
): Promise<User> {
  const setClauses: string[] = [];
  const updateValues: string[] = []; // Array to hold the values for the SQL query
  let index = 1; // Index for parameter placeholders in the query

  // Iterates through the key-value pairs of the 'properties' object.
  Object.entries(properties).forEach(([key, value]) => {
    // Build the SET clause dynamically using Object.entries for conciseness
    setClauses.push(`${key} = $${index}`);
    if (value) {
      updateValues.push(value); // Add the value to the updateValues array
    } else {
      updateValues.push("undefined");
    }

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

// Removes a user from the database.
export async function remove(id: User["user_id"]): Promise<User> {
  const query = "DELETE FROM users WHERE user_id = $1 RETURNING *;";
  const result = await db.query(query, [id]);
  return result.rows[0];
}
