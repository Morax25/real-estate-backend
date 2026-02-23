import { createProperty, getProperty } from '../services/property.services.ts';
import ApiResponse from '../utils/ApiResponse.ts';
import asyncHandler from '../utils/asyncHandler.ts';
import { HttpCode } from '../utils/statusCode.ts';

export const addProperty = asyncHandler(async (req, res) => {
  const property = await createProperty(req.body);
  res.status(HttpCode.CREATED).json(
    new ApiResponse({
      message: 'Property added successfully',
      data: property,
    })
  );
});

export const getPropertyController = asyncHandler(async (_, res) => {
  const property = await getProperty();
  res.status(HttpCode.OK).json(
    new ApiResponse({
      message: 'Data found successfully',
      data: property,
    })
  );
});
