import { Router } from 'express';
import EmailController from '../../../controllers/api/core/EmailController';

const emailRouter = Router();

emailRouter.post('/', EmailController.confirm);

export default emailRouter;