/**
 * Enhanced environment validation with better error handling and logging.
 */
import { serverEnvSchema, type ServerEnv } from "@ecommerce/shared";
import { z } from "zod";
import "dotenv/config"; // Load environment variables from .env file

/**
 * Parse and validate environment variables
 * Provides sensible defaults where appropriate
 */
function loadEnv(): ServerEnv {
  try {
    // Parse env with our schema, allowing defaults to be applied
    return serverEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Environment validation failed:");
      console.error(z.prettifyError(error));

      if (process.env.NODE_ENV === "production") {
        console.error(
          "Cannot start server with invalid environment configuration"
        );
        process.exit(1);
      } else {
        console.warn(
          "⚠️ Running with default values where possible. This may cause issues."
        );
      }
    }
    throw error;
  }
}

// Export validated and typed environment variables
export const env = loadEnv();
