import pg from 'pg';
import { config } from 'dotenv';
config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

export const query = (text: string, params: Array<any> = []) => {
    return pool.query(text, params);
}