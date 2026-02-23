import { createProperty, getProperty } from '../services/property.services.ts';
import asyncHandler from '../utils/asyncHandler.ts';

export const addProperty = asyncHandler(async (req, res) => {
  const property = await createProperty(req.body);
  res
    .status(201)
    .json({
      message: 'Property added successfully',
      success: true,
      data: property,
    });
});

export const getPropertyController = asyncHandler(async (_, res) => {
  const property = await getProperty();
  res
    .status(201)
    .json({ message: 'Data retrieved', sucess: true, data: property });
});
