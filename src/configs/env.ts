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
export const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
export const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
export const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
export const GMAIL_USER = process.env.GMAIL_USER;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

