import { authClient, type User } from "@/utils/auth-client";
import { useMutation } from "@tanstack/react-query";
import type { SignUpInput } from "./SignUpForm";
import { useErrorBoundary } from "react-error-boundary";

interface SignUpResponse {
  token: string | null;
  user: User;
}

export function useSignUp() {
  const { showBoundary } = useErrorBoundary();

  const {
    mutate: signUpWithEmail,
    data,
    error,
    isError,
    isPending,
  } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async ({ email, password, name }: SignUpInput) => {
      const { data: response, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        throw error;
      }

      return response as SignUpResponse;
    },
  });

  return {
    data,
    error,
    isError,
    isPending,
    signUpWithEmail,
  };
}
