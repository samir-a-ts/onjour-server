import { Router } from 'express';
import directorInfoRouter from './director';

const userInfoRouter = Router();

userInfoRouter.use('/director', directorInfoRouter);

export default userInfoRouter;