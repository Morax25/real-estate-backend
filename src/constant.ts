import dotenv from 'dotenv';
dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
export const DB_NAME = 'realestate';
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);
export const ACCESS_TOKEN_SECRET = requireEnv('ACCESS_TOKEN_SECRET');
export const ACCESS_TOKEN_EXPIRY = requireEnv('ACCESS_TOKEN_EXPIRY');
export const REFRESH_TOKEN_SECRET = requireEnv('REFRESH_TOKEN_SECRET');
export const REFRESH_TOKEN_EXPIRY = requireEnv('REFRESH_TOKEN_EXPIRY');
export const MONGODB_URI = requireEnv('MONGODB_URI');
export const PORT = Number(process.env.PORT) || 8000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const CLOUDINARY_CLOUD_NAME = requireEnv('CLOUDINARY_CLOUD_NAME');
export const CLOUDINARY_API_KEY = requireEnv('CLOUDINARY_API_KEY');
export const CLOUDINARY_API_SECRET = requireEnv('CLOUDINARY_API_SECRET');
