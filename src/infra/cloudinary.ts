// infra/cloudinary.ts
import { getCloudinary } from '../configs/cloudinary.js';

export const uploadToCloudinary = async (filePath: string) => {
  const cloudinary = getCloudinary();

  return cloudinary.uploader.upload(filePath, {
    folder: 'uploads',
  });
};
