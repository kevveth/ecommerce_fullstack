/**
 * Environment variable schemas and types shared between client and server.
 * Uses z.looseObject for server to allow extra OS/shell variables.
 * Follows Zod v4 conventions and project standards.
 */

import { z } from "zod/v4";

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
 * Server environment variable schema (Zod v4)
 * - Uses z.looseObject to allow extra OS/shell variables.
 * - Only validates the keys you care about.
 */
export const serverEnvSchema = z.looseObject({
  // Server Configuration
  PORT: z.coerce
    .number()
    .positive()
    .default(3000)
    .describe("Port for the server to listen on"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development")
    .describe("Application environment"),

  // Database Configuration
  DB_URL: z
    .string()
    .default("postgres://kennethrathbun:@localhost:5432/ecommerce")
    .describe("Database connection URL"),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().positive().default(5432),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().optional(),
  DB_DATABASE: z.string().default("ecommerce"),

  // Client URL (for CORS and redirects)
  CLIENT_URL: z.string().default("http://localhost:5173"),

  // Salt rounds for password hashing
  SALT_ROUNDS: z.coerce.number().int().positive().default(12),
});

/**
 * Client environment variable schema (Zod v4)
 */
export const clientEnvSchema = z.object({
  // Use .string().refine(...) for URL validation, as .string().url() is deprecated in Zod v4
  VITE_API_URL: z
    .url()
    .default("http://localhost:3000/api")
    .describe("Base URL for API requests"),
});

// Type exports for type safety
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
