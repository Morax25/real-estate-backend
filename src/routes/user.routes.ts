import { Router } from 'express';
import { login, signUp } from '../controller/user.controller.js';
import { validate } from '../middleware/validator.middleware.js';
import { loginSchema, signupSchema } from '../validators/user.validator.js';
const router = Router();

//user register and login routes
router.post('/login', validate(loginSchema), login);
router.post('/signup', validate(signupSchema), signUp);

export default router;
