import fs from "fs";
import path from "path";
import { pool } from "./database";

// Table to track migrations
const createMigrationsTable = `
  CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

// Define the migration row type
interface MigrationRow {
  name: string;
  executed_at: Date;
}

// Run all migration files that haven't been executed yet
export const runMigrations = async () => {
  console.log("Checking for database migrations...");

  try {
    // Create migrations table if it doesn't exist
    await pool.query(createMigrationsTable);

    // Get list of executed migrations
    const { rows: executedMigrations } = await pool.query<MigrationRow>(
      "SELECT name FROM migrations"
    );
    const executedMigrationNames = executedMigrations.map(
      (row: MigrationRow) => row.name
    );

    // Get all migration files
    const migrationsDir = path.join(__dirname, "migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort(); // Ensure migrations run in order

    // Execute migrations that haven't been applied yet
    for (const file of migrationFiles) {
      if (!executedMigrationNames.includes(file)) {
        console.log(`Applying migration: ${file}`);

        // Read and execute the migration
        const filePath = path.join(migrationsDir, file);
        const migration = fs.readFileSync(filePath, "utf-8");

        // Use a transaction for safety
        await pool.query("BEGIN");
        try {
          await pool.query(migration);
          await pool.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
          await pool.query("COMMIT");
          console.log(`Migration ${file} applied successfully`);
        } catch (error) {
          await pool.query("ROLLBACK");
          console.error(`Error applying migration ${file}:`, error);
          throw error;
        }
      } else {
        console.log(`Migration ${file} already applied, skipping`);
      }
    }

    console.log("Database migrations completed");
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  }
};
