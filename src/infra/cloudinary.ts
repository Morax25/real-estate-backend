import streamifier from 'streamifier';
import { getCloudinary } from '../configs/cloudinary.js';

export const uploadToCloudinary = async (file: Express.Multer.File) => {
  const cloudinary = getCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'uploads',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};
