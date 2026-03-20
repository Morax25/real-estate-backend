import { Types } from 'mongoose';

export interface IPriceHistoryItem {
  price: number;
  date: Date;
}

export interface ICenterDetails {
  title: string;
  subtitle: string;
}

export interface ISeatingOptions {
  title: string;
  description: string;
  isReserved: boolean;
  price: number;
  image: string;
}

export interface IProperty {
  _id: Types.ObjectId;
  title: string;
  spaceType: string;
  brandReviews: string;
  location: string;
  locationDetails: string;
  isVerified: boolean;
  centerDetails: ICenterDetails[];
  seatingOptions: ISeatingOptions[];
  timing: string;
  tag?: string;
  commonAmenities: string[];
  keywords: string[];
  images: string[];
  reviews: Types.ObjectId[];
  currentPrice: number;
  priceHistory: IPriceHistoryItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  _id: Types.ObjectId;
  propertyId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPropertyPopulated
  extends Omit<IProperty, 'reviews'> {
  reviews: IReview[];
}
