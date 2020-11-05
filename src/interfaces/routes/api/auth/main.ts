import { Router } from 'express';
import schoolRouter from './school/school';
import userRouter from './users/main';

const authRouter = Router();

authRouter.use('/user', userRouter);
authRouter.use('/school', schoolRouter);

export default authRouter;