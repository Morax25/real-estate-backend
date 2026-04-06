import { Router } from 'express';
import {
  addProperty,
  deletePropertyBulk,
  deletePropertyController,
  getPropertyByID,
  getProperyPaginationController,
  updateProperty,
} from '../controller/property.controller.js';
import { validate } from '../middleware/validator.middleware.js';
import {
  createPropertySchema,
  updatePropertySchema,
} from '../validators/property.validator.js';

const router = Router();

//user register and login routes
router.post('/add', validate(createPropertySchema), addProperty);
router.get('/id/:id', getPropertyByID);
router.delete('/', deletePropertyBulk);
router.delete('/:id', deletePropertyController);
router.patch('/:id', validate(updatePropertySchema), updateProperty);
router.get('/', getProperyPaginationController);

export default router;
