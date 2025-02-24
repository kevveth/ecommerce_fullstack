import pg from "pg";
import { env } from "../src/utils/env";

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.DB_URL,
});

export const query = (text: string, params: Array<any> = []) => {
  return pool.query(text, params);
};
