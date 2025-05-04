import { Pool, PoolClient } from "pg";
import { config } from "dotenv";
import { env } from "../utils/env";
import { initializeDatabase } from "./initializeDatabase";

config();

// Create a singleton database connection manager
class ConnectionManager {
  private static instance: ConnectionManager;
  private pool: Pool;
  private initialized = false;

  private constructor() {
    this.pool = new Pool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      // Additional connection settings for reliability
      max: 20, // Max number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 2000, // How long to wait for a connection
    });

    // Handle pool errors so they don't crash the application
    this.pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
    });

    // Log when pool creates a new client
    this.pool.on("connect", () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("Database pool client connected");
      }
    });
  }

  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  // Get the connection pool
  public getPool(): Pool {
    return this.pool;
  }

  /**
   * Initialize the database schema
   * This ensures all required tables exist before the application starts using the database
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await initializeDatabase(this.pool);
      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }

  // Execute a query using the pool
  public async query(text: string, params: any[] = []) {
    return this.pool.query(text, params);
  }

  // Get a client from the pool to execute multiple operations in a transaction
  public async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  // Execute queries with a transaction
  public async withTransaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  // Shutdown connections when the app is terminating
  public async close() {
    return this.pool.end();
  }
}

// Export the singleton instance
export const connectionManager = ConnectionManager.getInstance();
export const pool = connectionManager.getPool(); // For backward compatibility
export const query = connectionManager.query.bind(connectionManager);
export const withTransaction =
  connectionManager.withTransaction.bind(connectionManager);
