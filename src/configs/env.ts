import { config } from 'dotenv';
config();
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const required = ['PORT', 'DB_URI'];
console.log('NODE_ENV:', JSON.stringify(process.env.NODE_ENV));
export const PORT = Number(process.env.PORT);
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DB_URI = process.env.DB_URI;
