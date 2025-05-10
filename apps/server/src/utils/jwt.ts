import * as jose from "jose";
import { z } from "zod";

/**
 * Token types supported by the application
 */
export enum TokenType {
  ACCESS = "access",
  REFRESH = "refresh",
}

/**
 * Simple schema for user payload in JWT tokens
 * Note: We use passthrough() instead of strict() to allow standard JWT claims like iat and exp
 */
export const UserPayloadSchema = z
  .object({
    user_id: z.number().int().positive(),
    role: z.string(),
  })
  .passthrough(); // Allow extra properties like iat and exp added by jose

/**
 * Type derived from the schema for TypeScript usage
 */
export type UserPayload = z.infer<typeof UserPayloadSchema>;

/**
 * Gets the appropriate secret key for token operations
 *
 * @param type - The type of token (access or refresh)
 * @returns The secret key as a Uint8Array
 */
function getSecretKey(type: TokenType): Uint8Array {
  const secret =
    type === TokenType.REFRESH
      ? process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      : process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(`JWT secret not defined in environment variables`);
  }

  return new TextEncoder().encode(secret);
}

/**
 * Generates a JWT token
 *
 * @param payload - User payload for the token
 * @param type - Type of token to generate
 * @param expiresIn - Token expiration time (e.g., '15m', '7d')
 * @returns Promise resolving to the signed token
 */
export async function generateToken(
  payload: UserPayload,
  type: TokenType,
  expiresIn?: string
): Promise<string> {
  // Validate payload with Zod
  const result = UserPayloadSchema.safeParse(payload);
  if (!result.success) {
    const formattedError = z.prettifyError(result.error);
    throw new Error(`Invalid token payload: ${JSON.stringify(formattedError)}`);
  }

  const secretKey = getSecretKey(type);

  // Default expiration times
  const defaultExpiry = type === TokenType.ACCESS ? "15m" : "7d";

  // Create and sign the JWT
  const token = await new jose.SignJWT(result.data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn || defaultExpiry)
    .sign(secretKey);

  return token;
}

/**
 * Generates an access token
 *
 * @param payload - User payload
 * @param expiresIn - Optional expiration time
 * @returns Signed access token
 */
export async function generateAccessToken(
  payload: UserPayload,
  expiresIn?: string
): Promise<string> {
  return generateToken(payload, TokenType.ACCESS, expiresIn);
}

/**
 * Generates a refresh token
 *
 * @param payload - User payload
 * @param expiresIn - Optional expiration time
 * @returns Signed refresh token
 */
export async function generateRefreshToken(
  payload: UserPayload,
  expiresIn?: string
): Promise<string> {
  return generateToken(payload, TokenType.REFRESH, expiresIn);
}

/**
 * Generates both access and refresh tokens for a user
 *
 * @param payload - User payload
 * @returns Object containing both tokens
 */
export async function generateTokens(
  payload: UserPayload
): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  return { accessToken, refreshToken };
}

/**
 * Verifies and decodes a JWT token
 *
 * @param token - Token to verify
 * @param type - Type of token
 * @returns Decoded and validated payload
 */
export async function verifyToken(
  token: string,
  type: TokenType
): Promise<UserPayload> {
  try {
    const secretKey = getSecretKey(type);
    const { payload } = await jose.jwtVerify(token, secretKey);

    // Validate the payload structure
    const result = UserPayloadSchema.safeParse(payload);
    if (!result.success) {
      // Only log validation errors in development
      if (process.env.NODE_ENV === "development") {
        console.error(`JWT validation error:`, z.prettifyError(result.error));
      }
      throw new Error(`Invalid token structure`);
    }

    return result.data;
  } catch (error) {
    // Handle specific JOSE errors
    if (error instanceof jose.errors.JOSEError) {
      if (error.code === "ERR_JWT_EXPIRED") {
        throw new Error("Token has expired");
      } else {
        throw new Error(`Token verification failed: ${error.message}`);
      }
    }

    // Re-throw other errors
    throw error;
  }
}

/**
 * Safe version of verifyToken that doesn't throw
 *
 * @param token - Token to verify
 * @param type - Type of token
 * @returns Decoded payload or null if invalid
 */
export async function safeVerifyToken(
  token: string,
  type: TokenType
): Promise<UserPayload | null> {
  try {
    return await verifyToken(token, type);
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.error(
        "JWT verification failed:",
        error instanceof Error ? error.message : String(error)
      );
    }
    return null;
  }
}

/**
 * Decodes a JWT token without verification (for inspection only)
 *
 * @param token - JWT token to decode
 * @returns Decoded payload or null
 */
export function decodeToken(token: string): UserPayload | null {
  try {
    const decoded = jose.decodeJwt(token);
    const result = UserPayloadSchema.safeParse(decoded);
    return result.success ? result.data : null;
  } catch (error) {
    return null;
  }
}
