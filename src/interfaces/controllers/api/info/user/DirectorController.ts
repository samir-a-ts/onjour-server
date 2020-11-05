import { Request, Response } from 'express';
import { Socket } from 'socket.io';
import Fold from '../../../../../application/fold';
import serviceLocator from '../../../../../infrastructure/config/service_locator';

export default class DirectorInfoController {
    static async update(req: Request, res: Response): Promise<void> {
        const { uid } = req.body as { uid: string };

        const result = await serviceLocator.directorRepository.updateOne(uid, req.body);
        
        Fold.execute(
            result,
            () => {
                res.json({
                    errors: [],
                });
            },
            err => {
                res.json({
                    errors: [ err.toJSON() ],
                });
            },
        );
    }

    static async get(socket: Socket, body: unknown): Promise<void> {
        const { uid } = body as { uid: string };

        await serviceLocator.directorRepository.getOne(uid, socket);
    }
}