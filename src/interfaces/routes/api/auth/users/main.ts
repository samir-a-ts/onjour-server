import { Router } from 'express';
import directorRouter from './director';

const userRouter = Router();

userRouter.use('/director', directorRouter);

export default userRouter;