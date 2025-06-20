import { useState } from "react";
import { authClient, type User } from "@/utils/auth-client";
import { useErrorBoundary } from "react-error-boundary";
import type { SignUpInput } from "./SignUpForm";
import { BetterAuthError } from "better-auth";

interface SignUpResponse {
  token: string | null;
  user: User;
}

export function useSignUp() {
  const [data, setData] = useState<SignUpResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { showBoundary } = useErrorBoundary();

  async function signUpWithEmail({ email, password, name }: SignUpInput) {
    try {
      const { data: response, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        if (error.code === "USER_ALREADY_EXISTS") {
          setFormError(
            "An account with this email already exists. Please sign in instead."
          );
          return null;
        }

        throw error;
      }

      setData(response);
      return response;
    } catch (err) {
      showBoundary(err);
      return null;
    }
  }

  return {
    data,
    formError,
    signUpWithEmail,
  };
}
