import { useState } from "react";
import { authClient, type User } from "@/utils/auth-client";
import { useErrorBoundary } from "react-error-boundary";
import { z } from "zod/v4";
import { type SignUpInput } from "./SignUpForm";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  image: z.string().nullish(),
}) satisfies z.ZodType<User>;

type SignUpResponse = {
  token: string | null;
  user: User;
};

export function useSignUp() {
  const [data, setData] = useState<SignUpResponse | null>(null);
  const { showBoundary } = useErrorBoundary();

  async function signUpWithEmail({ email, password, name }: SignUpInput) {
    try {
      const { data, error } = await authClient.signUp.email(
        {
          email,
          password,
          name,
        },
        {
          //   output: userSchema,
          onRequest: () => {
            console.log("Signing up...");
          },
          onSuccess: (context) => {
            console.log("Sign up successful:", context.data);
          },
          onError(context) {
            console.error("Sign up failed", context.error);
          },
        }
      );

      if (error) throw new Error(`API call failed\n ${JSON.stringify(error)}`);

      setData(data);
    } catch (err) {
      showBoundary(err);
    }
  }

  return {
    data,
    signUpWithEmail,
  };
}
