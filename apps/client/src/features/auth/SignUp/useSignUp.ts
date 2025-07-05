import { authClient, type User } from "@/utils/auth-client";
import { useMutation } from "@tanstack/react-query";
import type { SignUpInput } from "./SignUpForm";
import { useNavigate } from "react-router";

interface SignUpResponse {
  token: string | null;
  user: User;
}

export function useSignUp() {
  const navigate = useNavigate();

  const {
    mutate: signUpWithEmail,
    data,
    error,
    isError,
    isPending,
  } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (data: SignUpInput) => {
      const { firstName, lastName, ...rest } = data;
      const { data: response, error } = await authClient.signUp.email({
        ...rest,
        name: `${firstName} ${lastName}`.trim(),
      });

      if (error) {
        throw error;
      }

      return response as SignUpResponse;
    },
    onError: (error) => console.error("Sign up error:", error),
    onSuccess: () => navigate("/"),
  });

  return {
    data,
    error,
    isError,
    isPending,
    signUpWithEmail,
  };
}
