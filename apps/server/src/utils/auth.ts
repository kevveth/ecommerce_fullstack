import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { env } from "./env.ts";

export const auth = betterAuth({
  database: new Pool({
    connectionString: env.DB_URL,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  trustedOrigins: [env.CLIENT_URL],
  // socialProviders: {}
});
