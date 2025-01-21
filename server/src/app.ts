import { config } from "dotenv";
config();

import express from "express";
import cors, { CorsOptions } from "cors";

const app = express();
const port = process.env.PORT || 3001;

const corsOptions: CorsOptions = {
  origin: `http://localhost:5173`,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
