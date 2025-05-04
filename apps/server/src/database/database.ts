import { connectionManager, pool, query } from "./connectionManager";

// Re-export the pool and query function for backward compatibility
export { pool, query };

// Export a shutdown function for graceful shutdown
export const shutdown = async () => {
  console.log("Closing database connections...");
  await connectionManager.close();
  console.log("Database connections closed.");
};
