import { Router } from 'express';
import authRouter from './auth/main';
import emailRouter from './core/email';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);

apiRouter.use('/email-confirm', emailRouter);

export default apiRouter;