import streamifier from 'streamifier';
import { getCloudinary } from '../configs/cloudinary.js';

export const uploadToCloudinary = async (file: Express.Multer.File) => {
  const cloudinary = getCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'uploads' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary error:', error);
          return reject(error);
        }
        if (!result) return reject(new Error('No result from Cloudinary'));
        resolve(result);
      }
    );

    if (!file.buffer) {
      return reject(new Error('Missing file buffer'));
    }

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};
