import { Property } from '../models/property.model.ts';
import asyncHandler from '../utils/asyncHandler.ts';
export const addProperty = asyncHandler(async (req, res) => {
  const {
    title,
    spaceType,
    brandReviews,
    location,
    locationDetails,
    centerDetails,
    seatingOptions,
    timing,
    tag,
    commonAmenities,
    keywords,
    images,
    price,
  } = req.body;
  const property = new Property({
    title,
    spaceType,
    brandReviews,
    location,
    locationDetails,
    seatingOptions,
    centerDetails,
    timing,
    tag,
    commonAmenities,
    keywords,
    images,
    price
  });

  await property.save()
  res.status(200).json({ message: 'Property Added successfully', success: true });
});
