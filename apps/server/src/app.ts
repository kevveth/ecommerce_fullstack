import { config } from "dotenv";
config();

import express, { type Express } from "express";
import "express-async-errors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import cors, { type CorsOptions } from "cors";
import apiRoutes from "./routes/routes.js";
import { errorHandler } from "./middleware/errors.js";
import { env } from "./utils/env.js";

const app: Express = express();

const corsOptions: CorsOptions = {
  origin: env.CLIENT_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};

// Auth routes
app.all("/api/auth/*", toNodeHandler(auth));

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.use("/api", apiRoutes);

// Error handling
app.use(errorHandler);

// Start server (skip in tests)
if (process.env.NODE_ENV !== "test") {
  const port = env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
