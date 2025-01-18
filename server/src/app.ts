import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: `http://localhost:${port}`,
    optionsSuccessStatus: 200,

}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
