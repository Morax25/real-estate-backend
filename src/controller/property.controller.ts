import {
  bulkDeleteProperties,
  createProperty,
  deleteProperty,
  getPaginatedProperties,
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

export const getPropertyByID = asyncHandler(async (req, res) => {
  const property = await getProperty(req.params.id as string);
  res.status(HttpCode.OK).json(
    new ApiResponse({
      message: 'Property retrieved successfully',
      data: property,
    })
  );
});

export const deletePropertyController = asyncHandler(async (req, res) => {
  await deleteProperty(req.params.id as string);
  res.status(HttpCode.OK).json(
    new ApiResponse({
      message: 'Property deleted successfully',
      data: null,
    })
  );
});

export const updateProperty = asyncHandler(async (req, res) => {
  const updatedData = await updatedPropertyService(
    req.params.id as string,
    req.body
  );
  res.status(HttpCode.OK).json(
    new ApiResponse({
      message: 'Property updated successfully',
      data: updatedData,
    })
  );
});

export const deletePropertyBulk = asyncHandler(async (req, res) => {
  const { ids } = req.body || [];
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.some((id) => typeof id !== 'string' || id.trim() === '')
  ) {
    throw new ApiError({
      statusCode: HttpCode.BAD_REQUEST,
      message: 'ids must be a non-empty array of non-empty strings',
    });
  }
  const deletedData = await bulkDeleteProperties(req.body.ids);
  res.status(HttpCode.OK).json(
    new ApiResponse({
      message: 'Properties deleted successfully',
      data: deletedData,
    })
  );
});

export const getProperyPaginationController = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const properties = await getPaginatedProperties(page, limit);
  res.status(HttpCode.OK).json(
    new ApiResponse({
      message: 'Properties retrieved successfully',
      data: properties,
    })
  );
});
