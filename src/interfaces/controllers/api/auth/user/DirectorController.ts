import { Request, Response } from 'express';
import Fold from '../../../../../application/fold';
import Director from '../../../../../domain/users/Director';
import serviceLocator from '../../../../../infrastructure/config/service_locator';
import { response } from '../../../../../application/server/response_encypter';
import decryptRequest from '../../../../../application/server/request_decrypter';

export default class DirectorAuthController {
    static async register(req: Request, res: Response): Promise<void> {
        const decrBody = decryptRequest(req.body);

        const director = Director.fromJSON(decrBody);

        const result = await serviceLocator.directorRepository.register(director);
        
        Fold.execute(
            result,
            uid => {
                const resp = {
                    errors: [],
                    result: uid,
                };

                response(resp, res);
            },
            err => {
                const resp = {
                    errors: [
                        err.toJSON(),
                    ],
                };

                response(resp, res);
            },
        );
    } 
    
    static async signIn(req: Request, res: Response): Promise<void> {
        const decrBody = decryptRequest(req.body);

        const { email, password } = decrBody as { email: string, password: string };

        const result = await serviceLocator.directorRepository.signIn(email, password);
        
        Fold.execute(
            result,
            uid => {
                const resp = {
                    errors: [],
                    result: uid,
                };

                response(resp, res);
            },
            err => {
                const resp = {
                    errors: [
                        err.toJSON(),
                    ],
                };

                response(resp, res);
            },
        );
    }
}