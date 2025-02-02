import * as db from '../database/database';
import Product from '../types/product';

const table = "products"

export async function get() {
    db.query("SELECT * FROM $1 ;", [table]);
}