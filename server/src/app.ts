import { config } from 'dotenv';
config();

import express from 'express';
import { Request, Response } from 'express-serve-static-core';
import 'express-async-errors';
import session from 'express-session';
import cors, { CorsOptions } from 'cors';
import apiRoutes from './routes/index';
import { errorHandler } from './middleware/errors';
import { initPassport, isAuthenticated } from './middleware/passport.mw';

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
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
  })
);

initPassport(app);

// Routes
app.get('/', (req, res) => {
  res.send("Hello World!");
});

app.use('/api', apiRoutes);

app.get('/api/user', isAuthenticated, async (req: Request, res: Response) => {
  res.send({ user: req.user });
});

// Error Handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;
