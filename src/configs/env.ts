import { config } from 'dotenv';

const ENV = process.env.NODE_ENV || 'development';

if (ENV !== 'production') {
  config();
  config({ path: `.env.${ENV}.local` });
}

const required = [
  'MONGODB_URI',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
}

console.log('NODE_ENV:', JSON.stringify(ENV));

export const NODE_ENV = ENV;
export const DB_URI = process.env.MONGODB_URI!;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!;
