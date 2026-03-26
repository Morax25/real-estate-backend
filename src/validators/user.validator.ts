import { z } from 'zod';
import { Types } from 'mongoose';

const objectId = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

const requiredString = (field: string) =>
  z.string().trim().min(1, `${field} is required`);

const emailSchema = z.string().trim().toLowerCase().email('Invalid email');

const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100);

const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Invalid phone number')
  .optional();

const urlSchema = z.string().url('Invalid URL');

const UserRoleEnum = z.enum(['buyer', 'seller', 'agent', 'admin']);

const PropertyTypeEnum = z.enum([
  'residential',
  'commercial',
  'plot',
  'villa',
  'apartment',
]);

const FurnishingTypeEnum = z.enum([
  'furnished',
  'semi-furnished',
  'unfurnished',
]);

const locationSchema = z.object({
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  country: z.string().trim().optional(),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{4,10}$/)
    .optional(),
});

const preferencesSchema = z
  .object({
    propertyType: PropertyTypeEnum.optional(),
    budget: z
      .object({
        min: z.number().nonnegative().optional(),
        max: z.number().nonnegative().optional(),
      })
      .optional(),
    bedrooms: z.number().int().nonnegative().optional(),
    furnishing: FurnishingTypeEnum.optional(),
  })
  .refine(
    (data) =>
      !data.budget ||
      data.budget.min === undefined ||
      data.budget.max === undefined ||
      data.budget.min <= data.budget.max,
    {
      message: 'Min budget cannot be greater than max budget',
      path: ['budget'],
    }
  );

export const userSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  phone_number: phoneSchema,
  avatar: urlSchema.optional(),
  role: UserRoleEnum.optional(),
  isEmailVerified: z.boolean().optional(),
  isPhoneVerified: z.boolean().optional(),
  location: locationSchema.optional(),
  savedProperties: z.array(objectId).optional(),
  recentlyViewed: z.array(objectId).optional(),
  preferences: preferencesSchema.optional(),
  isActive: z.boolean().optional(),
  isBanned: z.boolean().optional(),
  lastLogin: z.coerce.date().optional(),
});

export const signupSchema = z.object({
  name: requiredString('Name'),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type UserInput = z.infer<typeof userSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
