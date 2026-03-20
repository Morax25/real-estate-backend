import type { IProperty } from '../models/models.types.ts';
import { Property } from '../models/property.model.ts';
import ApiError from '../utils/ApiError.ts';
import { HttpCode } from '../utils/statusCode.ts';
import type { UpdatePropertyInput } from '../validators/property.validator.ts';

export const createProperty = async (data: IProperty) => {
  const property = new Property(data);
  await property.save();
  return property;
};

export const getProperties = async () => {
  const property = await Property.find()
  return property
}

export const getProperty = async (id: string) => {
  const property = await Property.findById(id);
  return property;
};

export const deleteProperty = async (id: string) => {
  const property = await Property.findByIdAndDelete(id);
  return property;
};

export const updatedPropertyService = async (id: string, data: UpdatePropertyInput) => {
  const updated = await Property.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new ApiError({
      statusCode: HttpCode.NOT_FOUND,
      message: 'Property not found',
    });
  }

  return updated;
};