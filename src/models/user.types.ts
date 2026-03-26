import { Types } from 'mongoose';

export type UserRole = 'buyer' | 'seller' | 'agent' | 'admin';
export type PropertyType =
  | 'residential'
  | 'commercial'
  | 'plot'
  | 'villa'
  | 'apartment';
export type FurnishingType = 'furnished' | 'semi-furnished' | 'unfurnished';

export interface ILocation {
  city: string;
  state: string;
  country: string;
  pincode?: string;
}

export interface IBudget {
  min: number;
  max: number;
}

export interface IPreferences {
  propertyType?: PropertyType;
  budget?: IBudget;
  bedrooms?: number;
  furnishing?: FurnishingType;
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone_number?: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  location?: ILocation;
  savedProperties: Types.ObjectId[];
  recentlyViewed: Types.ObjectId[];
  preferences?: IPreferences;
  isActive: boolean;
  isBanned: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
