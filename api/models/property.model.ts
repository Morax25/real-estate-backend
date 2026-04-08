import pkg, { type Model } from 'mongoose';
import type {
  ICenterDetails,
  IPriceHistoryItem,
  IProperty,
  ISeatingOptions,
} from './models.types.ts';

const { Schema, model, models, Types } = pkg;

const PriceHistorySchema = new Schema<IPriceHistoryItem>(
  {
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CenterDetailsSchema = new Schema<ICenterDetails>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
  },
  { _id: false }
);

const SeatingOptionsSchema = new Schema<ISeatingOptions>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    isReserved: { type: Boolean, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    spaceType: { type: String, required: true },
    brandReviews: { type: String, required: true },
    location: { type: String, required: true },
    locationDetails: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    centerDetails: {
      type: [CenterDetailsSchema],
      required: true,
      default: [],
    },
    seatingOptions: {
      type: [SeatingOptionsSchema],
      required: true,
      default: [],
    },
    timing: { type: String, required: true },
    tag: { type: String },
    commonAmenities: {
      type: [String],
      required: true,
      default: [],
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: 'At least one amenity is required in database',
      },
    },
    keywords: {
      type: [String],
      required: true,
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    reviews: [
      {
        type: Types.ObjectId,
        ref: 'Review',
      },
    ],
    currentPrice: { type: Number, required: true },
    priceHistory: { type: [PriceHistorySchema], default: [] },
  },
  { timestamps: true }
);

PropertySchema.index({ currentPrice: 1 });

export const Property: Model<IProperty> =
  (models.Property as Model<IProperty>) ||
  model<IProperty>('Property', PropertySchema);
