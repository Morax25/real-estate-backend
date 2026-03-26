import { Router } from 'express';
import { login, signUp } from '../controller/user.controller.ts';
import { validate } from '../middleware/validator.middleware.ts';
import { loginSchema, signupSchema } from '../validators/user.validator.ts';
const router = Router();

//user register and login routes
router.post('/login', validate(loginSchema), login);
router.post('/signup', validate(signupSchema), signUp);

export default router;
