import pg from 'pg';
import { env } from '../src/utils/env'

const { Pool } = pg;

const pool = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE
})

export const query = (text: string, params: Array<any> = []) => {
    return pool.query(text, params);
}