import type { IProperty } from '../models/models.types.ts';
import { Property } from '../models/property.model.ts';

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