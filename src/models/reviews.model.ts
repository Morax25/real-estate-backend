import { Schema, model, models } from 'mongoose';
import type { IReview } from './models.types.js';

const ReviewSchema = new Schema<IReview>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

export const Review = models.Review || model<IReview>('Review', ReviewSchema);
