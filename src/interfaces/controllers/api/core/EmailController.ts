import { Request, Response } from 'express';
import Fold from '../../../../application/fold';

import serviceLocator from '../../../../infrastructure/config/service_locator';

const { emailRepository }  = serviceLocator;

export default class EmailController {
    static async confirm(req: Request, res: Response): Promise<void> {
        const confirmOrFail = await emailRepository.confirmEmail(req.body.email);

        Fold.execute<string>(
            confirmOrFail,
            code => {
                res.json({
                    errors: [],
                    result: code,
                });
            },
                err => {
                    res.json({
                        errors: [
                            err.toJSON(),
                        ],
                    });
                },
            );
    }
}
