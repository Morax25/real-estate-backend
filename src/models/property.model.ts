import { Schema, model, models } from "mongoose";
import type { IPriceHistoryItem, IProperty } from "./models.types.ts";

const PriceHistorySchema = new Schema<IPriceHistoryItem>(
  {
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    timing: { type: String, required: true },
    tag: { type: String, required: true },
    keywords: { type: [String], required: true },
    price: {
      currentPrice: { type: Number, required: true },
      history: { type: [PriceHistorySchema], default: [] },
    },
    images: { type: [String], default: [] },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

export const Property =
  models.Property || model<IProperty>("Property", PropertySchema);
