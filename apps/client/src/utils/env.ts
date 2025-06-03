/**
 * Client environment configuration using shared schema
 */
import { clientEnvSchema, type ClientEnv } from "@ecommerce/schemas/env";
import { z } from "zod/v4";

/**
 * Parse and validate client environment variables
 * Provides sensible defaults where appropriate
 */
function loadEnv(): ClientEnv {
  try {
    // In Vite, environment variables are exposed on import.meta.env
    // Parse env with our schema, allowing defaults to be applied
    return clientEnvSchema.parse(import.meta.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Client environment validation failed:");
      console.error(z.prettifyError(error));
      console.warn(
        "⚠️ Using default values where possible. This may cause issues."
      );
    }
    // In client code, we'll continue with defaults rather than crash the application
    // For missing required values, TypeScript will handle this at compile time
    throw error;
  }
}

// Export validated and typed environment variables
export const env = loadEnv();
