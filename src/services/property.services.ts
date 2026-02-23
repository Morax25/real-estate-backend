import type { IProperty } from '../models/models.types.ts';
import { Property } from '../models/property.model.ts';

export const createProperty = async (data: IProperty) => {
  const property = new Property(data);
  await property.save();
  return property;
};

export const getProperty = async () => {
  const property = await Property.find()
  return property
}