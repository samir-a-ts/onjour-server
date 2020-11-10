import { Request, Response } from 'express';
import Fold from '../../../../application/fold';

import serviceLocator from '../../../../infrastructure/config/service_locator';
import decryptRequest from '../../../../application/server/request_decrypter';
import { response } from '../../../../application/server/response_encypter';

const { emailRepository }  = serviceLocator;

export default class EmailController {
    static async confirm(req: Request, res: Response): Promise<void> {
        const body = decryptRequest(req.body) as { email: string };

        const confirmOrFail = await emailRepository.confirmEmail(body.email);

        Fold.execute<string>(
            confirmOrFail,
            code => {

                const result = {
                    errors: [],
                    result: code,
                };

                response(result, res);
            },
                err => {

                    const result = {
                        errors: [
                            err.toJSON(),
                        ],
                    };

                    response(result, res);
                },
            );
    }
}
