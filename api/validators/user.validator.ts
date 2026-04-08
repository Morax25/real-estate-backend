import { Types } from 'mongoose';
import { z } from 'zod';

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

export const userSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  phone_number: phoneSchema,
  location: locationSchema.optional(),
});

export const signupSchema = z.object({
  name: requiredString('Name'),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: requiredString('Password'),
});

export type UserInput = z.infer<typeof userSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
