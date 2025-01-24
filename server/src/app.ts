import { config } from "dotenv";
config();

import express from "express";
import cors, { CorsOptions } from "cors";
import apiRoutes from "../src/routes/index"
import { errorHandler } from "./middleware/errors";

const corsOptions: CorsOptions = {
  origin: `http://localhost:5173`,
  optionsSuccessStatus: 200,
};
const port = process.env.PORT || 3001;

// Express initialization
const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use('/api', apiRoutes);


// Error Handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;
