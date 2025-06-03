/**
 * Environment variable schemas and types shared between client and server.
 * Uses z.looseObject for server to allow extra OS/shell variables.
 * Follows Zod v4 conventions and project standards.
 */

import { z } from "zod/v4";

/**
 * Log missing optional environment variables for better debugging
 * Uses Zod v4's prettifyError for clean, human-readable error messages
 */
export function logMissingOptionalEnvVars(
  envVars: Record<string, unknown>,
  schema: z.ZodSchema
): void {
  const result = schema.safeParse(envVars);

  if (!result.success) {
    const prettyError = z.prettifyError(result.error);

    console.warn("⚠️ Environment variable validation errors:");
    console.warn(prettyError);
  }
}

/**
 * Parse and validate environment variables with helpful error logging
 */
export function parseEnvVars<T>(
  envVars: Record<string, unknown>,
  schema: z.ZodSchema<T>
): T {
  const result = schema.safeParse(envVars);

  if (!result.success) {
    const prettyError = z.prettifyError(result.error);

    console.error("❌ Environment variable validation failed:");
    console.error(prettyError);

    throw new Error("Invalid environment variables");
  }

  return result.data;
}

/**
 * Server environment variable schema (Zod v4)
 * Uses z.looseObject to allow extra OS/shell variables
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

// Utility functions for common use cases
export const validateServerEnv = (
  envVars: Record<string, unknown>
): ServerEnv => parseEnvVars(envVars, serverEnvSchema);

export const validateClientEnv = (
  envVars: Record<string, unknown>
): ClientEnv => parseEnvVars(envVars, clientEnvSchema);
