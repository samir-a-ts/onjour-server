import { Router } from 'express';
import SchoolAuthController from '../../../../controllers/api/auth/school/SchoolController';

const schoolRouter = Router();

schoolRouter.post('/register', SchoolAuthController.register);

schoolRouter.post('/confirm', SchoolAuthController.confirm);

export default schoolRouter;