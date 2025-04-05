import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { FormFields } from "../pages/Register/RegistrationForm";

interface RegistrationSuccessData {
  user_id: number;
}

interface RegistrationSuccessResponse {
  data: RegistrationSuccessData;
}

type FieldErrors = Partial<Record<keyof FormFields, string[]>>;

interface RegistrationErrorResponse {
  message: string;
  errors?: FieldErrors;
}

const registerUserAPICall = async (
  data: FormFields
): Promise<RegistrationSuccessResponse> => {
  const response = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // Check if the response status indicates an error (not 2xx)
  if (!response.ok) {
    let parsedError: RegistrationErrorResponse | null = null;
    try {
      // Try to parse the JSON error body sent from the backend
      parsedError = (await response.json()) as RegistrationErrorResponse;
    } catch (e) {
      // If parsing JSON fails, parsedError remains null
      console.error("Failed to parse error response JSON:", e);
    }

    // --- Determine the best error message to throw ---
    let messageToThrow = "Registration failed due to an unknown server error."; // Final fallback

    // 1. Check for the specific nested email error first
    const specificEmailError = parsedError?.errors?.email?.[0];
    if (specificEmailError) {
      messageToThrow = specificEmailError; // Use "Email already exists"
    }
    // 2. If no specific email error, use the top-level message if available
    else if (parsedError?.message) {
      messageToThrow = parsedError.message; // Use "Validation failed"
    }
    // 3. Otherwise, keep the initial fallback (or refine it with status)
    else {
      messageToThrow =
        `HTTP error! Status: ${response.status} ${response.statusText || ""}`.trim();
    }
    // --- End determining message ---

    // Throw an error containing the most specific message found
    throw new Error(messageToThrow);
  }

  // If response is OK, parse the success JSON body
  const successData: RegistrationSuccessResponse =
    (await response.json()) as RegistrationSuccessResponse;
  return successData;
};

export const useRegisterUser = (): UseMutationResult<
  RegistrationSuccessResponse,
  Error,
  FormFields
> => {
  return useMutation<RegistrationSuccessResponse, Error, FormFields>({
    mutationFn: registerUserAPICall,
    onSuccess: ({ data }) => {
      console.log("Registration successful! User ID:", data.user_id);
    },
    onError: (error) => {
      console.error("Registration failed:", error.message);
    },
    onSettled: () => {
      console.log("Register mutation finished.");
    },
  });
};
