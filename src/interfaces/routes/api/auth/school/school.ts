import { Router } from 'express';
import SchoolController from '../../../../controllers/api/auth/school/SchoolController';

const schoolRouter = Router();

schoolRouter.post('/register', SchoolController.register);

schoolRouter.post('/confirm', SchoolController.confirm);

export default schoolRouter;