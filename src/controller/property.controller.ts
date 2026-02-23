import { createProperty, getProperty } from '../services/property.services.ts';
import ApiResponse from '../utils/ApiResponse.ts';
import asyncHandler from '../utils/asyncHandler.ts';

export const addProperty = asyncHandler(async (req, res) => {
  const property = await createProperty(req.body);
  new ApiResponse({
    statusCode: 201,
    message: 'Property added successfully',
    data: property,
  });
});

export const getPropertyController = asyncHandler(async (_, res) => {
  const property = await getProperty();
  new ApiResponse({
    statusCode: 200,
    message: 'Data found successfully',
    data: property,
  });
});
