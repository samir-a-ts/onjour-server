import School from '../../../../../domain/school/School';
import { Request, Response } from 'express';
import serviceLocator from '../../../../../infrastructure/config/service_locator';
import Fold from '../../../../../application/fold';
import decryptRequest from '../../../../../application/server/request_decrypter';
import { response } from '../../../../../application/server/response_encypter';

export default class SchoolAuthController {

    static async register(req: Request, res: Response): Promise<void> {
        const body = decryptRequest(req.body);

        const school = School.fromJSON(body);

        const result = await serviceLocator.schoolRepository.save(school);

        Fold.execute<void>(result, 
            () => {
                res.sendStatus(200);
            }, 
            (err) => {
                const resp = {
                    errors: [
                        err.toJSON(),
                    ],
                };

                response(resp, res);
            },
        );
    }

    static async confirm(req: Request, res: Response): Promise<void> {
        const body = decryptRequest(req.body);

        const { uid } = body as {uid: string};

        const result = await serviceLocator.schoolRepository.confirm(uid);
        
        Fold.execute<void>(
            result,
            () => {
                res.sendStatus(200);
            },
            (err) => {
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