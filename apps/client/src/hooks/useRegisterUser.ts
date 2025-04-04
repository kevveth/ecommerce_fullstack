import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { FormFields } from "../pages/Register/RegistrationForm";

interface RegistrationSuccessData {
  user_id: number;
}

interface RegistrationSuccessResponse {
  data: RegistrationSuccessData;
}

interface RegistrationErrorResponse {
  message: string;
  errors?: unknown;
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
    let errorData: RegistrationErrorResponse = {
      message: `HTTP error! Status: ${response.status}`,
    };
    try {
      // Try to parse the JSON error body sent from the backend
      errorData = (await response.json()) as RegistrationErrorResponse;
    } catch (e) {
      // If parsing JSON fails, stick with the basic HTTP error message
      console.error("Failed to parse error response JSON:", e);
    }
    // Throw an error with the message from the backend error response
    // This error will be caught by React Query and put into the 'error' state
    throw new Error(
      errorData.message || "Registration failed due to an unknown server error."
    );
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
