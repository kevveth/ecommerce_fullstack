/**
 * JWT Token utilities and schemas
 */
import { z } from "zod/v4";
import { RoleSchema } from "./user";

/**
 * Token types supported by the application
 */
export const TokenSchema = z.enum(["ACCESS", "REFRESH"]);
export type Token = z.infer<typeof TokenSchema>;
// export const TokenType = TokenSchema.enum;

/**
 * Schema for validating and transforming JWT secrets into Uint8Array format
 */
export const SecretKeySchema = z
  .string()
  .min(32, {
    message: "JWT secret should be at least 32 characters long for security",
  })
  .transform((secret) => new TextEncoder().encode(secret));

/**
 * Simple schema for user payload in JWT tokens
 * Note: We use z.looseObject() instead of z.strictObject() to allow standard JWT claims like iat and exp
 */
export const UserPayloadSchema = z.looseObject({
  user_id: z.number().int().positive(),
  role: RoleSchema,
}); // Passthrough allows extra properties like iat and exp added by jose

/**
 * Type derived from the schema for TypeScript usage
 */
export type UserPayload = z.infer<typeof UserPayloadSchema>;
