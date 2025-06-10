import { z } from "zod/v4";

export const signUpSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export type SignUpWithEmail = z.infer<typeof signUpSchema>;
