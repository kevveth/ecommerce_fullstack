import express, { type Express } from "express";

import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.ts";

import cors, { type CorsOptions } from "cors";
import { env } from "./utils/env.ts";
import { errorHandler } from "./middleware/errors.ts";
import apiRoutes from "./routes/routes.ts";
import { debug } from "console";

const app: Express = express();
const port = env.PORT;

const corsOptions: CorsOptions = {
  origin: env.CLIENT_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

// Auth routes
app.all("/api/auth/{*any}", toNodeHandler(auth));

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/me", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      res.status(404).json("User not found");
    } else {
      res.status(200).json(session);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get session" });
  }
});

app.use("/api", apiRoutes);

// Error handling
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", () => {
  debug("SIGINT signal received: closing HTTP server");
  server.close(() => {
    debug("HTTP server closed");
  });
});

export default app;
