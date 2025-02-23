import { config } from "dotenv";
config();

import express from "express";
import { Request, Response } from "express-serve-static-core";
import "express-async-errors";
import cors, { CorsOptions } from "cors";
import apiRoutes from "./routes/routes";
import { errorHandler } from "./middleware/errors";
import { env } from "./utils/env";
import cookieParser from "cookie-parser";
import { isAuthenticated } from "./middleware/verifyJWT";

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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;
