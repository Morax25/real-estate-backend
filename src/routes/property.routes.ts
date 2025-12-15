import { Router } from 'express';
import { validate } from '../middleware/validator.middleware.ts';
import { createPropertySchema } from '../validators/property.validator.ts';

const router = Router();

//user register and login routes
router.post('/add', validate(createPropertySchema));
export default router;
