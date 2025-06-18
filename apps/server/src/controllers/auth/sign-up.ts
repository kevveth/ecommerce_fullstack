import { auth } from "@/utils/auth.ts";
import { signUpSchema, type SignUpInput } from "@ecommerce/schemas/better-auth";
import { Request, Response, NextFunction } from "express";

/**
 * Controller for handling user sign-up requests
 * Accepts email and password, creates a new user account via better-auth
 */
export const signUpController = async (req: Request, res: Response) => {
  // Extract validated sign-up data from request body
  const body: SignUpInput = req.body;

  // Create new user account using better-auth
  const response = await signUp(body);

  // Parse the response from better-auth API
  const user = await response.json();

  // Return user data to client
  res.json({
    data: user,
  });
};

/**
 * Internal helper function to handle better-auth sign-up API call
 * @param data - User sign-up data (email, password, etc.)
 * @returns Response from better-auth API
 */
async function signUp(data: SignUpInput) {
  const response = await auth.api.signUpEmail({
    body: data,
    asResponse: true, // Return raw Response object instead of parsed data
  });

  return response;
}

/**
 * Middleware to validate sign-up request data using Zod schema
 * Should be used before signUpController to ensure data integrity
 */
export const validateSignUpData = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  // Validate request body against sign-up schema
  const { success, error } = signUpSchema.safeParse(req.body);

  if (!success) {
    // Pass validation error to error handling middleware
    next(error);
  } else {
    // Data is valid, proceed to next middleware/controller
    next();
  }
};
