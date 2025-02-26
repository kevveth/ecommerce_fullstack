import pg from "pg";
import { config } from "dotenv";
config();
import { env } from "../utils/env";
const { Pool } = pg;

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
});

// const pool = new Pool({
//   connectionString: env.DB_URL,
// });

export const query = (text: string, params: Array<any> = []) => {
  return pool.query(text, params);
};
