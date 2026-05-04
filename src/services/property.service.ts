import type { IProperty } from '../models/models.types.js';
import { Property } from '../models/property.model.js';
import { DomainError } from '../utils/domainError.js';
import type { UpdatePropertyInput } from '../validators/property.validator.js';

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

interface PaginationParams {
  page: number;
  limit: number;
  filters?: FilterOptions;
  sortBy?: string;
}

interface PaginationResult {
  data: IProperty[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const createProperty = async (data: IProperty) => {
  const property = new Property(data);
  await property.save();
  return property;
};

export const getProperties = async () => {
  return Property.find();
};

export const getProperty = async (id: string) => {
  const property = await Property.findById(id);
  if (!property) {
    throw new DomainError('NOT_FOUND', `Property not found`);
  }
  return property;
};

export const deleteProperty = async (id: string) => {
  const property = await Property.findByIdAndDelete(id);
  if (!property) {
    throw new DomainError('NOT_FOUND', `Property not found`);
  }
  return property;
};

export const updatedPropertyService = async (
  id: string,
  data: UpdatePropertyInput
) => {
  const updated = await Property.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new DomainError('NOT_FOUND', `Property not found`);
  }

  return updated;
};

export const bulkDeleteProperties = async (ids: string[]) => {
  const result = await Property.deleteMany({ _id: { $in: ids } });

  if (result.deletedCount === 0) {
    throw new DomainError(
      'NOT_FOUND',
      'No properties found for the provided IDs'
    );
  }

  return { deletedCount: result.deletedCount };
};

export const getPaginatedProperties = async ({
  page,
  limit,
  filters = {},
  sortBy,
}: PaginationParams): Promise<PaginationResult> => {
  const skip = (page - 1) * limit;

  const query: Record<string, any> = {};

  if (filters.product) {
    query.spaceType = filters.product;
  }

  if (filters.city) {
    query.city = filters.city;
  }

  if (filters.locations && filters.locations !== 'all') {
    query.location = { $regex: filters.locations, $options: 'i' };
  }

  if (filters.brands && filters.brands !== 'any') {
    query.brand = filters.brands;
  }

  if (filters.parking) {
    query.parking = filters.parking === 'yes';
  }

  if (filters.metro) {
    query.metroConnectivity = filters.metro;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.currentPrice = {};
    if (filters.minPrice !== undefined) {
      query.currentPrice.$gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      query.currentPrice.$lte = filters.maxPrice;
    }
  }

  let sort: Record<string, 1 | -1> = { createdAt: -1 };

  const normalizedSort = sortBy?.toLowerCase();

  if (normalizedSort === 'lowhigh') {
    sort = { currentPrice: 1 };
  } else if (normalizedSort === 'highlow') {
    sort = { currentPrice: -1 };
  } else if (normalizedSort === 'popular') {
    sort = { views: -1 };
  }

  const [properties, total] = await Promise.all([
    Property.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Property.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: properties,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
