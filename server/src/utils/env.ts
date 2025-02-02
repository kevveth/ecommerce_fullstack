import { z } from 'zod';

// Zod schema for validating environment variables
const envSchema = z.object({
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_DATABASE: z.string(),
    PORT:z.string(),
    SALT_ROUNDS:z.string(),
    SECRET_KEY: z.string()
})

// Parse environment variables and validate against the schema.  Throws an error if validation fails.
export const env = envSchema.parse(process.env);
