import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { env } from "../utils/env";

export const auth = betterAuth({
  database: new Pool({
    connectionString: env.DB_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
