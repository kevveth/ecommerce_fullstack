import * as jose from "jose";
import { z } from "zod";
import {
  SecretKeySchema,
  Token,
  UserPayloadSchema,
  UserPayload,
} from "@ecommerce/shared/schemas";
import { env } from "./env";

/**
 * Gets the appropriate secret key for token operations
 *
 * @param type - The type of token (access or refresh)
 * @returns The secret key as a Uint8Array
 */
function getSecretKey(type: Token): Uint8Array {
  const secret =
    type === "REFRESH"
      ? env.JWT_REFRESH_SECRET || env.JWT_SECRET
      : env.JWT_SECRET;

  // Use safeParse to validate secret key
  const result = SecretKeySchema.safeParse(secret);

  if (!result.success) {
    const formattederror = z.prettifyError(result.error);
    throw new Error(
      `JWT secret validation failed: ${JSON.stringify(formattederror)}`
    );
  }

  // Return the transformed secret key
  return result.data;
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
  type: Token,
  expiresIn?: string
): Promise<string> {
  // Validate payload with Zod
  const result = UserPayloadSchema.safeParse(payload);
  if (!result.success) {
    const formattedError = z.prettifyError(result.error);
    throw new Error(`Invalid token payload: ${JSON.stringify(formattedError)}`);
  }

  const secretKey = getSecretKey(type);

  // Default expiration times based on token type
  const defaultExpiry = type === "ACCESS" ? "15m" : "7d";
  const expiration = expiresIn || defaultExpiry;

  // Create and sign the JWT
  try {
    const token = await new jose.SignJWT(result.data)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiration)
      .sign(secretKey);

    return token;
  } catch (error) {
    const message =
      error instanceof jose.errors.JOSEError
        ? `Token signing failed: ${error.message}`
        : "Unexpected error during token signing";

    throw new Error(message);
  }
}

/**
 * Generates an access token
 *
 * @param payload - User payload
 * @param expiresIn - Optional expiration time
 * @returns Signed access token
 */
export function generateAccessToken(
  payload: UserPayload,
  expiresIn?: string
): Promise<string> {
  return generateToken(payload, "ACCESS", expiresIn);
}

/**
 * Generates a refresh token
 *
 * @param payload - User payload
 * @param expiresIn - Optional expiration time
 * @returns Signed refresh token
 */
export function generateRefreshToken(
  payload: UserPayload,
  expiresIn?: string
): Promise<string> {
  return generateToken(payload, "REFRESH", expiresIn);
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
  // Generate tokens in parallel
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(payload),
    generateRefreshToken(payload),
  ]);

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
  type: Token
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
  type: Token
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
