/**
 * Environment variable schemas and types shared between client and server
 */
import { z } from "zod";

/**
 * Log missing optional environment variables for better debugging
 */
function logMissingOptionalEnvVars(
  envVars: Record<string, unknown>,
  schema: z.ZodSchema
) {
  const parsed = schema.safeParse(envVars);
  if (!parsed.success) {
    parsed.error.issues.forEach((issue) => {
      if (issue.code === "invalid_type" && issue.path.length > 0) {
        console.warn(
          `⚠️ Missing optional environment variable: ${issue.path.join(".")}`
        );
      }
    });
  }
}

/**
 * Server environment variable schema
 */
export const serverEnvSchema = z.object({
  // Server Configuration
  PORT: z.coerce.number().positive().default(3001),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Database Configuration
  DB_URL: z
    .string()
    .refine(
      (url) => {
        try {
          const parsedUrl = new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      {
        message:
          "Invalid URL format. Ensure it includes a semicolon if no password is provided.",
      }
    )
    .default("postgres://localhost:5432/ecommerce"),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().positive().default(5432),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().optional(),
  DB_DATABASE: z.string().default("ecommerce"),

  // JWT Configuration
  JWT_SECRET: z.string().min(8),
  JWT_REFRESH_SECRET: z.string().min(8),
  JWT_ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_TOKEN_EXPIRY: z.string().default("7d"),

  // Client URL (for CORS and redirects)
  CLIENT_URL: z.string().optional().default("http://localhost:5173"),

  // Salt rounds for password hashing
  SALT_ROUNDS: z.coerce.number().int().positive().default(12),

  // Google OAuth Configuration (optional - only required when using OAuth)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

/**
 * Client environment variable schema
 */
export const clientEnvSchema = z.object({
  // API URL
  VITE_API_URL: z.string().url().default("http://localhost:3001/api"),

  // Authentication redirect URL (optional)
  VITE_AUTH_REDIRECT_URL: z.string().url().optional(),
});

// Type exports for type safety
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
