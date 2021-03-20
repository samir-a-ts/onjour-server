import { Request, Response } from 'express';
import { Socket } from 'socket.io';
import Fold from '../../../../../application/fold';
import serviceLocator from '../../../../../infrastructure/config/service_locator';
import { response } from '../../../../../application/server/response_encypter';
import decryptRequest from '../../../../../application/server/request_decrypter';

export default class DirectorInfoController {
    static async update(req: Request, res: Response): Promise<void> {
        const body = decryptRequest(req.body);

        const { uid } = body as { uid: string };

        const result = await serviceLocator.directorRepository.updateOne(uid, body);
        
        Fold.execute(
            result,
            () => {
                const resp = {
                    errors: [],
                };

                response(resp, res);
            },
            err => {
                const resp = {
                    errors: [ err.toJSON() ],
                };

                response(resp, res);
            },
        );
    }

    static async get(socket: Socket, body: { token: string }): Promise<void> {
        const decrBody = decryptRequest(body);

        const { uid } = decrBody as { uid: string };

        await serviceLocator.directorRepository.getOne(uid, socket);
    }
}