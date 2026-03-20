import { z } from 'zod';
import { Types } from 'mongoose';

const objectId = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

const requiredString = (field: string) =>
  z.string().min(1, `${field} is required`);

const nonNegativeNumber = (field: string) =>
  z
    .number()
    .refine((val) => !isNaN(val), { message: `${field} must be a number` })
    .refine((val) => val >= 0, { message: `${field} must be >= 0` });

const centerDetailsSchema = z.object({
  title: requiredString('Center title'),
  subtitle: requiredString('Center subtitle'),
});

const seatingOptionsSchema = z.object({
  title: requiredString('Seating title'),
  description: requiredString('Seating description'),
  isReserved: z.boolean(),
  price: nonNegativeNumber('Seating price'),
  image: requiredString('Image'),
});

export const createPropertySchema = z.object({
  title: requiredString('Title'),
  spaceType: requiredString('Space type'),
  brandReviews: requiredString('Brand reviews'),
  location: requiredString('Location'),
  locationDetails: requiredString('Location details'),

  isVerified: z.boolean().optional().default(false),

  centerDetails: z
    .array(centerDetailsSchema)
    .min(1, 'At least one center detail is required'),

  seatingOptions: z
    .array(seatingOptionsSchema)
    .min(1, 'At least one seating option is required'),

  timing: requiredString('Timing'),
  tag: requiredString('Tag').optional(),

  commonAmenities: z
    .array(requiredString('Amenity'))
    .min(1, 'At least one amenity is required')
    .default([]),

  keywords: z
    .array(requiredString('Keyword'))
    .min(1, 'At least one keyword is required'),

  images: z.array(requiredString('Image')).default([]),

  reviews: z.array(objectId).optional().default([]),

  currentPrice: nonNegativeNumber('Current price'),
});

export const updatePropertySchema = createPropertySchema
  .partial()
  .strict()
  .superRefine((data, ctx) => {
    if ('priceHistory' in data) {
      ctx.addIssue({
        code: 'custom',
        message: 'priceHistory cannot be updated',
      });
    }
  });

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
