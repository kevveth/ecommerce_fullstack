import * as db from "../database/database";

const table = "products";

export async function get() {
  db.query("SELECT * FROM $1 ;", [table]);
}
