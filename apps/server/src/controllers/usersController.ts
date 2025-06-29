import { Request, Response, NextFunction } from "express";
import { z } from "zod/v4";
import NotFoundError from "../errors/NotFoundError.ts";
import BadRequestError from "../errors/BadRequestError.ts";
import {
  getAll,
  getWithId,
  getWithUsername,
  update,
  remove,
} from "../services/users.ts";
import { userSchema, profileUpdateSchema } from "@ecommerce/schemas/user"; // Updated import to use profileUpdateSchema

// Enhanced param schemas with better error messages
const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^[1-9]\d*$/, { message: "ID must be a positive integer" })
    .transform((str) => parseInt(str)),
});

const usernameParamSchema = z.object({
  username: z.string().min(1, { message: "Username cannot be empty" }),
});

/**
 * Custom error formatter function for ID-related validation errors
 * Uses Zod's prettifyError for consistent formatting
 *
 * @param error - The Zod error object to format
 * @returns A formatted error message or object
 */
function formatIdError(error: z.ZodError): string | Record<string, any> {
  // Check if any error is related to the id field
  const hasIdError = error.issues.some((issue) => {
    // First check if this issue relates to the id field
    if (!issue.path.includes("id")) return false;

    // For Zod v4, use a string-based code check instead of enum values
    // Check if code exists and is one of our target error types
    return (
      issue.code != null &&
      ["invalid_type", "too_small", "too_big", "invalid_string"].includes(
        issue.code
      )
    );
  });

  if (hasIdError) {
    return "Invalid ID format";
  }

  // Use Zod's built-in error prettification as recommended in coding guidelines
  return z.prettifyError(error);
}

// Update validateSchema to return a strongly typed object
function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new BadRequestError({
      message: "Validation failed",
      context: { errors: z.prettifyError(result.error) },
    });
  }
  return result.data; // Return strongly typed data
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const result = await getAll();

    if (!result || result.length === 0) {
      // Consider returning a 404 or an empty array based on API design
      return res.status(404).json({ message: "No users found" });
    }

    // Parse all users with better error handling
    const users = result.map((user) => userSchema.parse(user));
    res.status(200).json({ users: users }); // Changed data to users
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

//Handles getting a user by ID
export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = validateSchema(idParamSchema, req.params);
    const result = await getWithId(id);

    if (!result) {
      // Use NotFoundError for consistency
      return next(
        new NotFoundError({
          message: `User with ID ${id} not found`,
          logging: true,
        })
      );
    }

    const user = userSchema.parse(result);
    res.status(200).json({ user: user }); // Changed data to user
  } catch (error) {
    // Pass errors to next for centralized error handling
    next(error);
  }
}

export async function getUserByUsername(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Use safeParse for better error handling
    const usernameResult = usernameParamSchema.safeParse(req.params);

    if (!usernameResult.success) {
      // Use BadRequestError for consistency
      return next(
        new BadRequestError({
          message: "Validation failed",
          context: { errors: z.prettifyError(usernameResult.error) },
        })
      );
    }

    const { username } = usernameResult.data;

    // Handle special cases for 'me' or undefined username
    if (username === "me" || !username) {
      // This case should ideally be handled by a dedicated /me route
      // or by ensuring req.user is populated by authentication middleware
      return next(
        new BadRequestError({
          message: "Invalid username provided for this endpoint.",
        })
      );
    }

    const result = await getWithUsername(username);

    if (!result) {
      // Use NotFoundError for consistency
      return next(
        new NotFoundError({
          message: `User with username ${username} not found`,
          logging: true,
        })
      );
    }

    const user = userSchema.parse(result);
    res.status(200).json({ user: user }); // Changed data to user
  } catch (error) {
    next(error);
  }
}

//Handles updating an existing user
// export async function updateUser(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const { id } = validateSchema(idParamSchema, req.params);

//     // Ensure `updateData` is properly typed
//     const updateData = validateSchema(profileUpdateSchema, req.body) as Record<
//       string,
//       unknown
//     >;

//     // Check if `updateData` is empty
//     if (Object.keys(updateData).length === 0) {
//       return res.status(400).json({
//         message: "At least one field must be provided for update.",
//       });
//     }

//     const result = await update(id, updateData);

//     if (!result) {
//       throw new NotFoundError({
//         message: "User not found",
//         logging: true,
//         context: {
//           method: "PUT",
//           expected: "user",
//           received: "undefined",
//           path: ["users", "id"],
//           id,
//         },
//       });
//     }

//     const user = userSchema.parse(result);
//     res.status(200).json({
//       message: "User updated successfully",
//       data: user,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

//Handles deleting a user
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Validate ID with better error handling
    const idResult = idParamSchema.safeParse(req.params);

    if (!idResult.success) {
      return res.status(400).json({
        message: "Invalid user ID",
        errors: z.prettifyError(idResult.error),
      });
    }

    const { id } = idResult.data;
    await remove(id);
    // 204 No Content is more appropriate for successful DELETE
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
