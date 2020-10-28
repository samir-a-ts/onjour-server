import School from '../../../../../domain/school/School';
import { Request, Response } from 'express';
import serviceLocator from '../../../../../infrastructure/config/service_locator';
import Fold from '../../../../../application/fold';

export default class SchoolController {

    static async register(req: Request, res: Response): Promise<void> {
        /// TODO: [SECURITY] Parsing data

        const school = School.fromJSON(req.body);

        const result = await serviceLocator.schoolRepository.save(school);

        Fold.execute<void>(result, 
            () => {
                res.sendStatus(200);
            }, 
            (err) => {
                res.json({
                    errors: [
                        err.toJSON(),
                    ],
                });
            },
        );
    }

    static async confirm(req: Request, res: Response): Promise<void> {
        /// TODO: SECURITY!

        const { uid } = req.body as {uid: string};

        const result = await serviceLocator.schoolRepository.confirm(uid);
        
        Fold.execute<void>(
            result,
            () => {
                res.sendStatus(200);
            },
            (err) => {
                res.json({
                    errors: [
                        err.toJSON(),
                    ],
                });
            },
        );


    }
}