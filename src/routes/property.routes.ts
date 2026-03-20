import { Router } from 'express';
import { validate } from '../middleware/validator.middleware.ts';
import { createPropertySchema, updatePropertySchema } from '../validators/property.validator.ts';
import { addProperty, deletePropertyController, getPropertyByID, getPropertyController, updateProperty } from '../controller/property.controller.ts';

const router = Router();

//user register and login routes
router.post('/add', validate(createPropertySchema), addProperty);
router.get('/get', getPropertyController)
router.get('/:id', getPropertyByID)
router.delete('/:id', deletePropertyController);
router.patch('/:id', validate(updatePropertySchema), updateProperty)

export default router;
