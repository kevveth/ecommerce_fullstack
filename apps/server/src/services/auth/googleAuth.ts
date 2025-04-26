import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { getWithEmail } from "../users";
import { addRefreshToken } from "./refresh";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { User } from "../../models/user.model";
import { pool } from "../../database/database";

// Optional: Configuration for allowed email domains (for domain restriction)
const ALLOWED_EMAIL_DOMAINS = process.env.ALLOWED_EMAIL_DOMAINS
  ? process.env.ALLOWED_EMAIL_DOMAINS.split(",")
  : []; // Empty array means no restriction

export interface GoogleUser {
  user_id?: number;
  username: string;
  email: string;
  password_hash: null;
  role: string;
  google_id: string;
}

export const setupGoogleAuth = () => {
  // Check for required Google OAuth credentials
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  // If credentials aren't available, log a warning and return without setting up the strategy
  if (!clientID || !clientSecret) {
    console.warn(
      "Google OAuth credentials missing. Google authentication will not be available."
    );
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user info from Google profile
          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : undefined;

          if (!email) {
            return done(
              new Error("Google authentication failed: No email provided")
            );
          }

          // Domain validation (if ALLOWED_EMAIL_DOMAINS is configured)
          if (ALLOWED_EMAIL_DOMAINS.length > 0) {
            // Make sure we have a valid email with a domain part
            const emailParts = email.split("@");
            if (emailParts.length !== 2 || !emailParts[1]) {
              return done(
                new Error("Google authentication failed: Invalid email format")
              );
            }

            const emailDomain = emailParts[1];
            if (!ALLOWED_EMAIL_DOMAINS.includes(emailDomain)) {
              return done(
                new Error(
                  `Authentication failed: Email domain ${emailDomain} is not allowed`
                )
              );
            }
          }

          // Check if user already exists
          let user = await getWithEmail(email);

          // Prevent account linking attacks by verifying identity
          if (user && user.google_id && user.google_id !== profile.id) {
            return done(
              new Error(
                "Authentication failed: Account already linked to another Google account"
              )
            );
          }

          if (!user) {
            // Create a new user if they don't exist
            const newUser: GoogleUser = {
              // Ensure username is always a string
              username: (profile.displayName || email.split("@")[0]) as string,
              email: email,
              password_hash: null, // No password for OAuth users
              role: "user", // Default role
              google_id: profile.id,
            };

            // Create the user in the database
            user = await createGoogleUser(newUser);
          } else if (!user.google_id) {
            // Link Google ID to existing user if not already linked
            if (user.user_id) {
              await linkGoogleAccount(user.user_id, profile.id);
              user.google_id = profile.id;
            } else {
              return done(new Error("User exists but has no user_id"));
            }
          }

          // Ensure user_id is present (required by Passport type definitions)
          if (!user || !user.user_id) {
            return done(
              new Error("Failed to get or create user with valid ID")
            );
          }

          // Convert to fully typed user object with non-optional user_id
          const authUser = {
            ...user,
            user_id: user.user_id, // This ensures user_id is not undefined
          };

          return done(null, authUser);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
};

// Helper function to create a Google authenticated user
async function createGoogleUser(userData: GoogleUser) {
  try {
    // Replace with your database logic to create a user
    // This is a placeholder implementation
    const query = `
      INSERT INTO users (username, email, password_hash, role, google_id) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;

    // Use the imported pool directly instead of dynamic import
    const result = await pool.query(query, [
      userData.username,
      userData.email,
      null, // No password for Google users
      userData.role,
      userData.google_id,
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("Error creating Google user:", error);
    throw error;
  }
}

// Helper function to link Google account to existing user
async function linkGoogleAccount(
  userId: number,
  googleId: string
): Promise<void> {
  try {
    const query = `UPDATE users SET google_id = $1 WHERE user_id = $2`;

    // Use the imported pool directly instead of dynamic import
    await pool.query(query, [googleId, userId]);
  } catch (error) {
    console.error("Error linking Google account:", error);
    throw error;
  }
}
