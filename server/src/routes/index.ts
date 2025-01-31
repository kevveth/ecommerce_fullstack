import express from 'express';
import loginRouter from './auth/loginRoute'
import usersRouter from './usersRoute';

const router = express.Router();

// Mount all API routes under /api
router.use('/login', loginRouter);
router.use('/users', usersRouter);

export default router;
