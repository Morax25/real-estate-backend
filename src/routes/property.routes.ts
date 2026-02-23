import { Router } from 'express';
import { validate } from '../middleware/validator.middleware.ts';
import { createPropertySchema } from '../validators/property.validator.ts';
import { addProperty, getPropertyController } from '../controller/property.controller.ts';

const router = Router();

//user register and login routes
router.post('/add', validate(createPropertySchema), addProperty);
router.get('/getProduct', getPropertyController)

export default router;
