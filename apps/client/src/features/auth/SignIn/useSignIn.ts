import { authClient } from "@/utils/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

type SignInInput = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export function useSignIn() {
  const navigate = useNavigate();

  const {
    mutate: signIn,
    isPending,
    error,
    isError,
  } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async ({
      email,
      password,
      rememberMe = false,
    }: SignInInput) => {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  return {
    signIn,
    isPending,
    error,
    isError,
  };
}
