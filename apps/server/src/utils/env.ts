import { z } from "zod";

// Zod schema for validating environment variables
const envSchema = z
  .object({
    PORT: z
      .string()
      .optional()
      .default("3000")
      .refine((v) => Number(v) < 65535, "Invalid port range"),
    DB_DATABASE: z.string().optional().default("ecommerce"),
    DB_HOST: z.string().optional().default("localhost"),
    DB_PORT: z.string().optional().default("5432"),
    DB_USER: z.string().optional(),
    DB_PASSWORD: z.string().optional(),
    DB_URL: z.string().optional(),
    SALT_ROUNDS: z.string().optional().default("10"),
    JWT_SECRET: z.string().optional(),
    JWT_ACCESS_TOKEN_EXPIRY: z.string().optional(),
    JWT_REFRESH_TOKEN_EXPIRY: z.string().optional(),
  })
  .transform((data) => {
    const port = parseInt(data.PORT);
    const dbPort = parseInt(data.DB_PORT);
    const saltRounds = parseInt(data.SALT_ROUNDS);
    const user = data.DB_USER ?? undefined;
    const password = data.DB_PASSWORD ?? undefined;
    const accessTokenExpiry = data.JWT_ACCESS_TOKEN_EXPIRY ?? undefined;

    return {
      ...data,
      PORT: port,
      DB_PORT: dbPort,
      SALT_ROUNDS: saltRounds,
      DB_USER: user,
      DB_PASSWORD: password,
      JWT_ACCESS_TOKEN_EXPIRY: accessTokenExpiry,
    };
  });

// Parse environment variables and validate against the schema.  Throws an error if validation fails.
export const env = envSchema.parse(process.env);
