import { minLength, z } from "zod/v4";

const clientEnv = z.object({
  VITE_CLIENT_URL: z.url({ error: "Invalid Client URL" }),
  VITE_API_URL: z.url({ error: "Invalid API URL" }),
  VITE_DATABASE_URL: z.string().optional(),
  VITE_BETTER_AUTH_SECRET: z.string().optional(),
  VITE_BETTER_AUTH_TRUSTED_ORIGINS: z
    .string()
    .min(1, { error: "Trusted origins cannot be empty if provided" })
    .transform((list) => list.split(",").map((url) => url.trim()))
    .pipe(
      z.array(
        z
          .url({ error: "Invalid URL in trusted origins list" })
          .min(1, "Trusted origins list cannot be empty")
      )
    )
    .optional(),
});

function parseClientEnv() {
  const { data, success, error } = clientEnv.safeParse(import.meta.env);

  if (!success) {
    console.error(
      "❌ (client) Invalid environment variables:",
      z.prettifyError(error)
    );
    throw new Error("Invalid client environment configuration.");
  }

  return data;
}

export const env = parseClientEnv();
