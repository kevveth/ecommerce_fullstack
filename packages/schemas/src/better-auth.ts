import { z } from "zod/v4";

export const signUpSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  image: z.string().optional(),
  callbackURL: z.string().optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
