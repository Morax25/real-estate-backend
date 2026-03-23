import type { IProperty } from '../models/models.types.ts';
import { Property } from '../models/property.model.ts';
import { DomainError } from '../utils/domainError.ts';
import type { UpdatePropertyInput } from '../validators/property.validator.ts';

export const createProperty = async (data: IProperty) => {
  const property = new Property(data);
  await property.save();
  return property;
};

export const getProperties = async () => {
  const properties = await Property.find();
  return properties;
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

export const getPaginatedProperties = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [properties, total] = await Promise.all([
    Property.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    Property.countDocuments(),
  ]);
  if (total === 0) {
    throw new DomainError('NOT_FOUND', 'No properties found');
  }
   return {
    data: properties,
    meta:{
      total,
      page,
      limit,
      totalPages:Math.ceil(total/limit),
      hasNextPage:page < Math.ceil(total/limit),
      hasPrevPage: page > 1,
    }
   }
};
