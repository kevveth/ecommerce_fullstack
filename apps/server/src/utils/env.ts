import { z } from "zod";

// Custom error map for more descriptive environment variable validation errors
const envErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === "invalid_type") {
    return {
      message: `${issue.path.join(".")} is required or has an invalid type`,
    };
  }
  if (issue.code === "custom") {
    return { message: ctx.defaultError };
  }
  return { message: ctx.defaultError };
};

// Improved Zod schema for validating environment variables with more specific validations
const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce
      .number()
      .int()
      .positive()
      .max(65535, "Port number must be less than 65535")
      .default(3000),
    DB_DATABASE: z
      .string()
      .min(1, "Database name is required")
      .default("ecommerce"),
    DB_HOST: z
      .string()
      .min(1, "Database host is required")
      .default("localhost"),
    DB_PORT: z.coerce
      .number()
      .int()
      .positive()
      .max(65535, "Database port must be less than 65535")
      .default(5432),
    DB_USER: z.string().optional(),
    DB_PASSWORD: z.string().optional(),
    DB_URL: z.string().url("Database URL must be a valid URL").optional(),
    SALT_ROUNDS: z.coerce
      .number()
      .int()
      .min(10, "Salt rounds should be at least 10 for security")
      .max(20, "Salt rounds should not exceed 20 for performance")
      .default(12),
    JWT_SECRET: z
      .string()
      .min(32, "JWT secret should be at least 32 characters for security")
      .optional(),
    JWT_ACCESS_TOKEN_EXPIRY: z
      .string()
      .regex(
        /^\d+[smhd]$/,
        "Token expiry must be in format like '15m', '24h', '7d'"
      )
      .default("15m"),
    JWT_REFRESH_TOKEN_EXPIRY: z
      .string()
      .regex(
        /^\d+[smhd]$/,
        "Token expiry must be in format like '15m', '24h', '7d'"
      )
      .default("7d"),
  })
  .refine(
    (data) => {
      // If we're in production, JWT_SECRET is required
      return data.NODE_ENV !== "production" || !!data.JWT_SECRET;
    },
    {
      message: "JWT_SECRET is required in production environment",
      path: ["JWT_SECRET"],
    }
  );

// Define the strongly typed environment schema
export type Env = z.infer<typeof envSchema>;

// Attempt to parse and validate environment variables
function loadEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        "❌ Invalid environment variables:",
        JSON.stringify(error.format(), null, 2)
      );
      process.exit(1);
    }
    throw error;
  }
}

// Export validated and typed environment variables
export const env = loadEnv();
