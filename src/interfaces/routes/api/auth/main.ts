import { Router } from 'express';
import schoolRouter from './school/school';

const authRouter = Router();

authRouter.use('/school', schoolRouter);

export default authRouter;