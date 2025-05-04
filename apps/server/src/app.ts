import { config } from "dotenv";
config();

// Validate required environment variables for Google authentication
function validateEnvVars() {
  const requiredVars = [
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "CLIENT_URL",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
    return false;
  }

  return true;
}

import express from "express";
import { Request, Response } from "express";
import "express-async-errors";
import cors, { CorsOptions } from "cors";
import passport from "passport";
import apiRoutes from "./routes/routes";
import { errorHandler } from "./middleware/errors";
import { env } from "./utils/env";
import cookieParser from "cookie-parser";
import { isAuthenticated } from "./middleware/verifyJWT";
import { setupGoogleAuth } from "./services/auth/googleAuth";
import { connectionManager } from "./database/connectionManager";
import { shutdown as shutdownDatabase } from "./database/database";

const corsOptions: CorsOptions = {
  origin: `http://localhost:5173`,
  optionsSuccessStatus: 200,
  credentials: true,
};
const port = env.PORT || 3001;

// Express initialization
const app = express();
app.use(cookieParser()); // JWT: For HTTP only cookies

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Initialize Passport and setup Google OAuth
app.use(passport.initialize());
setupGoogleAuth();

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", apiRoutes);

app.get("/api/me", isAuthenticated, async (req: Request, res: Response) => {
  res.send({ user: req.user });
});

// Error Handling
app.use(errorHandler);

// Only start the server if this file is run directly (not imported in tests)
if (require.main === module) {
  // Validate environment variables before starting
  if (!validateEnvVars()) {
    process.exit(1);
  }

  // Initialize database schema before starting the server
  connectionManager
    .initialize()
    .then(() => {
      const server = app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
      });

      // Graceful shutdown handling
      process.on("SIGTERM", gracefulShutdown(server));
      process.on("SIGINT", gracefulShutdown(server));
    })
    .catch((err) => {
      console.error("Failed to initialize database:", err);
      process.exit(1);
    });
} else {
  // For testing purposes - don't initialize database
  console.log(
    "App imported (not running directly) - skipping database initialization"
  );
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
