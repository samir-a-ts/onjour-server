import { Router } from 'express';
import DirectorAuthController from '../../../../controllers/api/auth/user/DirectorController';

const directorRouter = Router();

directorRouter.post('/register', DirectorAuthController.register);
directorRouter.post('/sign-in', DirectorAuthController.signIn);

export default directorRouter;