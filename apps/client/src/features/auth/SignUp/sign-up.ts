import { authClient, type User } from "@/utils/auth-client";
import type { SignUpInput } from "@ecommerce/schemas/better-auth";
import { z } from "zod/v4";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  image: z.string().nullish(),
}) satisfies z.ZodType<User>;

export default async function signUp({ email, password, name }: SignUpInput) {
  const { data } = await authClient.signUp.email({
    email,
    password,
    name,
    fetchOptions: {
      output: userSchema,
      onRequest: () => {
        // show loading state
        console.log("Sign up request started");
      },
      onSuccess: (ctx) => {
        // redirect to the dashboard or sign in page
        console.log("Sign up successful:", ctx.data);
      },
      onError: (ctx) => {
        // display the error message
        alert(ctx.error.message);
      },
    },
  });
}
