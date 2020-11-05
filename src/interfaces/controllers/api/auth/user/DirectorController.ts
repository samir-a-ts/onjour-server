import { Request, Response } from 'express';
import Fold from '../../../../../application/fold';
import Director from '../../../../../domain/users/Director';
import serviceLocator from '../../../../../infrastructure/config/service_locator';

export default class DirectorAuthController {
    static async register(req: Request, res: Response): Promise<void> {
        const director = Director.fromJSON(req.body);

        const result = await serviceLocator.directorRepository.register(director);
        
        Fold.execute(
            result,
            uid => {
                res.json({
                    errors: [],
                    result: uid,
                });
            },
            err => {
                res.json({
                    errors: [ err.toJSON() ],
                });
            },
        );
    } 
    
    static async signIn(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body as { email: string, password: string };

        const result = await serviceLocator.directorRepository.signIn(email, password);
        
        Fold.execute(
            result,
            uid => {
                res.json({
                    errors: [],
                    result: uid,
                });
            },
            err => {
                res.json({
                    errors: [ err.toJSON() ],
                });
            },
        );
    }
}