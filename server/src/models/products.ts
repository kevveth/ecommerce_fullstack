import { pool } from '../../database/db/database';
import Product from '../types/product';

const table = "products"

export async function get() {
    pool.query("SELECT * FROM $1 ;", [table]);
}