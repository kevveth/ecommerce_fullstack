/**
 * Enhanced environment validation with better error handling and logging.
 */
import { minLength, z } from "zod/v4";
import "dotenv/config"; // Load environment variables from .env file
import { error } from "console";

// enum modes {
//   dev = "development",
//   prod = "production",
//   test = "testing",
// };

const modes = ["development", "production", "test"] as const;

const serverEnv = z.object({
  PORT: z
    .string()
    .transform((str) => {
      let port = str;
      if (!port) {
        console.log(
          "🔧 PORT not specified, defaulting to 3000. Set PORT environment variable to change."
        );
        port = "3000";
      }
      return Number.parseInt(port);
    })
    .pipe(z.number().gte(0).lte(65535)),
  NODE_ENV: z.enum(modes).default("development"),
  DB_URL: z.url().optional(),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().max(65535).default(5432),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_DATABASE: z.string(),
  CLIENT_URL: z.url().default("http://localhost:5173/"),
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.url({ error: "Invalid URL for BetterAuth" }),
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
    const prettyError = z.prettifyError(error);
    throw new Error(
      `❤️‍🩹  Invalid server environment configuration\n${prettyError}`
    );
  }

  console.log("🐝 Server environment variables validated successfully.");
  return data;
}

// Export validated and typed environment variables
export const env = parseServerEnv();
