import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { type RegistrationInput } from "../../../../packages/shared/dist/esm/schemas";

interface RegistrationSuccessData {
  userId: number;
  username: string;
  email: string;
}

interface RegistrationSuccessResponse {
  message: string;
  data: RegistrationSuccessData;
}

// Improved error types to match our new Zod error format
interface RegistrationErrorResponse {
  message: string;
  errors?: {
    [key: string]: {
      errors: string[];
    };
  };
}

const registerUserAPICall = async (
  data: RegistrationInput
): Promise<RegistrationSuccessResponse> => {
  const response = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include", // Includes cookies in the request
  });

  // Check if the response status indicates an error (not 2xx)
  if (!response.ok) {
    let parsedError: RegistrationErrorResponse | null = null;
    try {
      parsedError = await response.json();
    } catch (e) {
      console.error("Failed to parse error response JSON:", e);
    }

    // Create an error object with structured information
    const error = new Error() as Error & { data?: RegistrationErrorResponse };

    // Assign the parsed error data
    error.data = parsedError || {
      message:
        `HTTP error! Status: ${response.status} ${response.statusText || ""}`.trim(),
    };

    // Set a user-friendly message
    error.message =
      parsedError?.message ||
      "Registration failed. Please check your information and try again.";

    throw error;
  }

  // If response is OK, parse the success JSON body
  return await response.json();
};

export const useRegisterUser = (): UseMutationResult<
  RegistrationSuccessResponse,
  Error & { data?: RegistrationErrorResponse },
  RegistrationInput
> => {
  return useMutation<
    RegistrationSuccessResponse,
    Error & { data?: RegistrationErrorResponse },
    RegistrationInput
  >({
    mutationFn: registerUserAPICall,
    onSuccess: (data) => {
      console.log("Registration successful!", data);
    },
    onError: (error) => {
      console.error("Registration failed:", error.message, error.data);
    },
    onSettled: () => {
      console.log("Register mutation finished.");
    },
  });
};
