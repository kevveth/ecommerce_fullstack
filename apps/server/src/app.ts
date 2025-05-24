import { config } from "dotenv";
config();

import express from "express";
import "express-async-errors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors, { CorsOptions } from "cors";
import apiRoutes from "./routes/routes";
import { errorHandler } from "./middleware/errors";
import { env } from "./utils/env";
import { shutdown as shutdownDatabase } from "./database/database";

const corsOptions: CorsOptions = {
  origin: env.CLIENT_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};
const port = env.PORT || 3000;

// Express initialization
const app: express.Application = express();

app.all("/api/auth/*}", toNodeHandler(auth));

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", apiRoutes);

// Error Handling
app.use(errorHandler);

// Only start the server if this file is run directly (not imported in tests)
if (require.main === module) {
  // Start server directly - database schema is managed by better-auth
  const server = app.listen(port, () => {
    console.log(`Better Auth app is running on port ${port}`);
  });

  // Graceful shutdown handling
  process.on("SIGTERM", gracefulShutdown(server));
  process.on("SIGINT", gracefulShutdown(server));
} else {
  // For testing purposes
  console.log("App imported (not running directly)");
}

// Graceful shutdown function
function gracefulShutdown(server: any) {
  return async () => {
    console.log("Received shutdown signal, closing server...");

    server.close(async () => {
      console.log("HTTP server closed.");

      try {
        // Close database connections
        await shutdownDatabase();
        console.log("All connections closed. Shutting down gracefully.");
        process.exit(0);
      } catch (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
      }
    });

    // Force close after 10s if server.close() hangs
    setTimeout(() => {
      console.error("Server close timeout! Forcing shutdown.");
      process.exit(1);
    }, 10000);
  };
}

export default app;
