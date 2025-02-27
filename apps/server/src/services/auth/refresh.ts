import { query } from "../../database/database";

interface RefreshToken {
  id: number;
  user_id: number;
  token: string;
  created_at: Date;
}

async function addRefreshToken(userId: number, token: string): Promise<void> {
  try {
    await query("INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)", [
      userId,
      token,
    ]);
  } catch (error) {
    console.log("Error adding refresh token", error);
    throw error;
  }
}

async function findRefreshToken(token: string): Promise<RefreshToken | null> {
  try {
    const result = await query(
      "SELECT * FROM refresh_tokens WHERE token = $1",
      [token]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as RefreshToken;
  } catch (error) {
    console.error("Error finding refresh token: ", error);
    throw error;
  }
}

async function removeRefreshToken(token: string): Promise<void> {
  try {
    await query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
  } catch (error) {
    console.error("Error removing refresh token: ", error);
    throw error;
  }
}

async function removeAllRefreshTokensForUser(userId: number): Promise<void> {
  try {
    await query("DELETE FROM refresh_tokens WHERE user_id = $1", [userId]);
  } catch (error) {
    console.error("Error removing refresh token: ", error);
    throw error;
  }
}

export {
  addRefreshToken,
  findRefreshToken,
  removeRefreshToken,
  removeAllRefreshTokensForUser,
};
