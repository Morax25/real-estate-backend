import { Types } from "mongoose";

// Price history entry
export interface IPriceHistoryItem {
  price: number;
  date: Date;
}

export interface ICenterDetails{
  title:string;
  subtitle:string
}

// Property document type
export interface IProperty {
  _id: Types.ObjectId;
  title: string;
  location: string;
  spaceType:string;
  centerDetails:ICenterDetails[];

  timing: string;
  tag: string;
  keywords: string[];
  images: string[];
  reviews:IReview[]
  price: {
    currentPrice: number;
    history: IPriceHistoryItem[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Review document type
export interface IReview {
  _id: Types.ObjectId;
  propertyId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}
