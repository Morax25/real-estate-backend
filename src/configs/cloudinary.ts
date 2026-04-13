import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from './env.js';

let instance: typeof cloudinary | null = null;

export const getCloudinary = () => {
  if (!instance) {
    const config: ConfigOptions = {
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    };

    cloudinary.config(config);
    instance = cloudinary;
  }

  return instance;
};
