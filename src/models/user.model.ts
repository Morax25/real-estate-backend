import bcrypt from 'bcryptjs';
import pkg, { Document, type Model } from 'mongoose';
import type {
  FurnishingType,
  IUser,
  PropertyType,
  UserRole,
} from './user.types.js';

const { Schema, model, models } = pkg;

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone_number: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'agent', 'admin'] satisfies UserRole[],
      default: 'buyer' satisfies UserRole,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    location: {
      city: { type: String },
      state: { type: String },
      country: { type: String },
      pincode: { type: String },
    },
    savedProperties: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
    recentlyViewed: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
    preferences: {
      propertyType: {
        type: String,
        enum: [
          'residential',
          'commercial',
          'plot',
          'villa',
          'apartment',
        ] satisfies PropertyType[],
      },
      budget: {
        min: { type: Number },
        max: { type: Number },
      },
      bedrooms: { type: Number },
      furnishing: {
        type: String,
        enum: [
          'furnished',
          'semi-furnished',
          'unfurnished',
        ] satisfies FurnishingType[],
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) throw new Error('Password not set on user');
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save', async function (next) {
  const user = this as IUserDocument;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err as any);
  }
});

export const User: IUserModel =
  (models.User as IUserModel) ||
  model<IUserDocument, IUserModel>('User', userSchema);
