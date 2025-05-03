import { z } from "zod";

/**
 * Custom URL validator that's more lenient with local development URLs
 */
const urlSchema = z.string().refine(
  (val) => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Invalid URL format" }
);

/**
 * Environment variable schema using Zod v4 features
 */
const envSchema = z
  .object({
    // Server settings
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().max(65535).default(3000),

    // Database settings
    DB_DATABASE: z.string().min(1).default("ecommerce"),
    DB_HOST: z.string().min(1).default("localhost"),
    DB_PORT: z.coerce.number().int().positive().max(65535).default(5432),
    DB_USER: z.string().optional(),
    DB_PASSWORD: z.string().optional(),
    DB_URL: urlSchema.optional(),

    // Security settings
    SALT_ROUNDS: z.coerce.number().int().min(10).max(20).default(12),
    JWT_SECRET: z.string().min(32).optional(),
    JWT_REFRESH_SECRET: z.string().min(32).optional(),
    JWT_ACCESS_TOKEN_EXPIRY: z
      .string()
      .regex(/^\d+[smhd]$/)
      .default("15m"),
    JWT_REFRESH_TOKEN_EXPIRY: z
      .string()
      .regex(/^\d+[smhd]$/)
      .default("7d"),

    // Client settings
    CLIENT_URL: urlSchema.default("http://localhost:5173"),

    // OAuth settings
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  })
  .meta({
    description: "Server environment configuration",
    source: "Environment variables",
    version: "1.0",
  })
  .refine((data) => data.NODE_ENV !== "production" || !!data.JWT_SECRET, {
    message: "JWT_SECRET is required in production environment",
    path: ["JWT_SECRET"],
  })
  .refine(
    (data) => data.NODE_ENV !== "production" || !!data.JWT_REFRESH_SECRET,
    {
      message: "JWT_REFRESH_SECRET is required in production environment",
      path: ["JWT_REFRESH_SECRET"],
    }
  );

// Define the strongly typed environment schema
export type Env = z.infer<typeof envSchema>;

/**
 * Parses and validates environment variables
 * @returns Validated and typed environment variables
 */
function loadEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Environment validation failed:");
      console.error(z.prettifyError(error));
      process.exit(1);
    }
    throw error;
  }
}

// Export validated and typed environment variables
export const env = loadEnv();
