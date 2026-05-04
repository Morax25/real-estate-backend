import { Request, Response } from 'express';
import {
  bulkDeleteProperties,
  createProperty,
  deleteProperty,
  getPaginatedProperties,
  getProperty,
  updatedPropertyService,
} from '../services/property.service.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HttpCode } from '../utils/statusCode.js';

interface FilterOptions {
  product?: string;
  city?: string;
  locations?: string;
  brands?: string;
  parking?: string;
  metro?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const addProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const property = await createProperty(req.body);
    res.status(HttpCode.CREATED).json(
      new ApiResponse({
        message: 'Property added successfully',
        data: property,
      })
    );
  }
);

export const getPropertyByID = asyncHandler(
  async (req: Request, res: Response) => {
    const property = await getProperty(req.params.id as string);
    res.status(HttpCode.OK).json(
      new ApiResponse({
        message: 'Property retrieved successfully',
        data: property,
      })
    );
  }
);

export const deletePropertyController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteProperty(req.params.id as string);
    res.status(HttpCode.OK).json(
      new ApiResponse({
        message: 'Property deleted successfully',
        data: null,
      })
    );
  }
);

export const updateProperty = asyncHandler(
  async (req: Request, res: Response) => {
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
  }
);

export const deletePropertyBulk = asyncHandler(
  async (req: Request, res: Response) => {
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

    const deletedData = await bulkDeleteProperties(ids);
    res.status(HttpCode.OK).json(
      new ApiResponse({
        message: 'Properties deleted successfully',
        data: deletedData,
      })
    );
  }
);

export const getProperyPaginationController = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const sortBy =
      typeof req.query.sortBy === 'string' ? req.query.sortBy : undefined;

    const filters: FilterOptions = {};

    if (req.query.product && typeof req.query.product === 'string') {
      filters.product = req.query.product;
    }

    if (req.query.city && typeof req.query.city === 'string') {
      filters.city = req.query.city;
    }

    if (req.query.locations && typeof req.query.locations === 'string') {
      filters.locations = req.query.locations;
    }

    if (req.query.brands && typeof req.query.brands === 'string') {
      filters.brands = req.query.brands;
    }

    if (req.query.parking && typeof req.query.parking === 'string') {
      filters.parking = req.query.parking;
    }

    if (req.query.metro && typeof req.query.metro === 'string') {
      filters.metro = req.query.metro;
    }

    if (req.query.minPrice) {
      const minPrice = Number(req.query.minPrice);
      if (!isNaN(minPrice) && minPrice >= 0) {
        filters.minPrice = minPrice;
      }
    }

    if (req.query.maxPrice) {
      const maxPrice = Number(req.query.maxPrice);
      if (!isNaN(maxPrice) && maxPrice >= 0) {
        filters.maxPrice = maxPrice;
      }
    }

    const result = await getPaginatedProperties({
      page,
      limit,
      filters,
      ...(sortBy && { sortBy }),
    });

    res.status(HttpCode.OK).json(
      new ApiResponse({
        message: 'Properties retrieved successfully',
        data: result,
      })
    );
  }
);
