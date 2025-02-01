import express from 'express';
import loginRouter from './auth/loginRoute'
import usersRouter from './usersRoute';
import registrationRoute from './auth/registrationRoute'

const router = express.Router();

// Mount all API routes under /api
router.use('/register', registrationRoute);
router.use('/login', loginRouter);
router.use('/users', usersRouter);

export default router;
