import { createAuthClient } from "better-auth/react";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const authClient = createAuthClient({
  baseURL: process.env.API_URL || "http://localhost:3000",
});
