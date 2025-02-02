import { NewUser, User } from "../../models/user.model";
import * as db from "../../database/database";

// Creates a new user.
export async function create(data: NewUser): Promise<User> {
  const query =
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id;";
  const result = await db.query(query, [
    data.username,
    data.email,
    data.password,
  ]);

  return result.rows[0];
}