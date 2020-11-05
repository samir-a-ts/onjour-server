import { Router } from 'express';
import DirectorInfoController from '../../../../../controllers/api/info/user/DirectorController';

const directorInfoRouter = Router();

directorInfoRouter.post('/update', DirectorInfoController.update);

export default directorInfoRouter;