import { Router } from 'express';
import userInfoRouter from './routes/main';

const infoRouter = Router();

infoRouter.use('/user', userInfoRouter);

export default infoRouter;