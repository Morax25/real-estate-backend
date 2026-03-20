import {
  createProperty,
  deleteProperty,
  getProperties,
  getProperty,
  updatedPropertyService,
} from '../services/property.services.ts';
import ApiError from '../utils/ApiError.ts';
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
  const property = await getProperties();
  res.status(HttpCode.OK).json(
    new ApiResponse({
      message: 'Data found successfully',
      data: property,
    })
  );
});

export const getPropertyByID = asyncHandler(async (req, res) => {
  const property = await getProperty(req.params.id || '');
  res.status(HttpCode.OK).json(
    new ApiResponse({
      message: 'Data found successfully',
      data: property,
    })
  );
});

export const deletePropertyController = asyncHandler(async (req, res) => {
  const property = await deleteProperty(req.params.id as string);
  res
    .status(HttpCode.OK)
    .json(
      new ApiResponse({
        message: 'Property deleted successfully',
        data: property,
      })
    );
});

export const updateProperty = asyncHandler(async (req, res) => {
  if (!req.params.id)
    throw new ApiError({
      statusCode: HttpCode.BAD_REQUEST,
      message: 'Property ID missing',
    });
  const updatedData = await updatedPropertyService(req.params.id, req.body);
  res.status(HttpCode.OK).json(
    new ApiResponse({
      message: 'Property Updated Successfully',
      data: updatedData,
    })
  );
});
