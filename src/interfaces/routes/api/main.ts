import { Router } from 'express';
import authRouter from './auth/main';
import emailRouter from './core/email';
import { Server } from 'socket.io';
import configureSchool from './info/school/main';

export async function configureInfo(ws: Server): Promise<void> {
    configureSchool(ws);
}

const apiRouter = Router();

apiRouter.use('/auth', authRouter);

apiRouter.use('/email-confirm', emailRouter);

export default apiRouter;