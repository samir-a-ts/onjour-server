import { Router } from 'express';
import authRouter from './auth/main';
import emailRouter from './core/email';
import { Server } from 'socket.io';
import configureSchool from './info/school/main';
import configureUser from './info/user/ws/main';
import infoRouter from './info/user/main';

export async function configureInfo(ws: Server): Promise<void> {
    configureSchool(ws);

    configureUser(ws);
}

const apiRouter = Router();

apiRouter.use('/auth', authRouter);

apiRouter.use('/info', infoRouter);

apiRouter.use('/email-confirm', emailRouter);

export default apiRouter;