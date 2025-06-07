/**
 * Enhanced environment validation with better error handling and logging.
 */
import { z } from "zod/v4";
import "dotenv/config"; // Load environment variables from .env file

// enum modes {
//   dev = "development",
//   prod = "production",
//   test = "testing",
// };

const modes = ["development", "production", "test"] as const;

const serverEnv = z.object({
  NODE_ENV: z
    // .literal(["development", "production", "string"])
    .enum(modes)
    .default("development"),
  DB_URL: z.url().optional(),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z
    .string()
    .default("3000")
    .transform((val) => Number.parseInt(val)),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_DATABASE: z.string().optional(),
  CLIENT_URL: z.url().default("http://localhost:5173/"),
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_TRUSTED_ORIGINS: z
    .string()
    .min(1, { error: "Trusted origins cannot be empty if provided" })
    .transform((list) => list.split(",").map((url) => url.trim()))
    .pipe(
      z.array(
        z
          .url({ error: "Invalid URL in trusted origins list" })
          .min(1, "Trusted origins list cannot be empty")
      )
    )
    .optional(),
});

function parseServerEnv() {
  const { data, success, error } = serverEnv.safeParse(process.env);

  if (!success) {
    console.error(
      "❌ (server) Invalid environment variables:",
      z.prettifyError(error)
    );
    throw new Error("Invalid server environment configuration.");
  }

  return data;
}

// Export validated and typed environment variables
export const env = parseServerEnv();
