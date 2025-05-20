/**
 * Environment variable schemas and types shared between client and server
 */
import { z } from "zod";

/**
 * Log missing optional environment variables for better debugging
 */
export function logMissingOptionalEnvVars(
  envVars: Record<string, unknown>,
  schema: z.ZodSchema
): void {
  const result = schema.safeParse(envVars);

  if (!result.success) {
    // Use Zod v4's prettifyError to get nicer error messages
    const prettyError = z.prettifyError(result.error);

    const issues = result.error.issues.filter(
      (issue) => issue.code === "invalid_type" && issue.path.length > 0
    );

    if (issues.length > 0) {
      console.warn("⚠️ Missing optional environment variables:");
      issues.forEach((issue) => {
        console.warn(`  - ${issue.path.join(".")}: ${issue.message}`);
      });
    }
  }
}

/**
 * Server environment variable schema
 */
export const serverEnvSchema = z.object({
  // Server Configuration
  PORT: z.coerce
    .number()
    .positive()
    .default(3001)
    .describe("Port for the server to listen on"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development")
    .describe("Application environment"),

  // Database Configuration
  DB_URL: z
    .string()
    .refine(
      (url) => {
        // Handle both URL format and connection string format for PostgreSQL
        try {
          // Try to parse as standard URL first
          new URL(url);
          return true;
        } catch {
          // If not a standard URL, check if it's a PostgreSQL connection string
          // Format: postgresql://username:password@hostname:port/database
          // Or: postgres://username:password@hostname:port/database
          return /^postgres(?:ql)?:\/\/(?:[^:@\/]+(?::[^@\/]+)?@)?[^:@\/]+(?::\d+)?(?:\/[^?]*)?(?:\?.*)?$/.test(
            url
          );
        }
      },
      {
        message: "Invalid PostgreSQL connection string format",
      }
    )
    .default("postgres://kennethrathbun:@localhost:5432/ecommerce")
    .describe("Database connection URL"),
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
});

/**
 * Client environment variable schema
 */
export const clientEnvSchema = z.object({
  // API URL
  VITE_API_URL: z
    .string()
    .url()
    .default("http://localhost:3001/api")
    .describe("Base URL for API requests"),

  // Authentication redirect URL (optional)
  VITE_AUTH_REDIRECT_URL: z
    .string()
    .url()
    .optional()
    .describe("URL to redirect after authentication"),
});

// Type exports for type safety
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
