import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME!;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var _mongoose: MongooseCache | undefined;
}

function getCache(): MongooseCache {
  if (!global._mongoose) {
    global._mongoose = { conn: null, promise: null };
  }
  return global._mongoose; // always read live from global
}

export async function connectDB() {
  const cache = getCache(); // fresh reference on every call

  if (cache.conn) {
    console.log('✅ Using cached DB connection');
    return cache.conn;
  }

  if (!cache.promise) {
    console.log('⚡ Creating new DB connection...');
    cache.promise = mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      // removed bufferCommands: false
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      maxPoolSize: 3,
    });
  }

  try {
    cache.conn = await cache.promise;
    console.log('✅ DB connected successfully');
  } catch (error) {
    console.error('❌ DB connection failed:', error);
    cache.promise = null;
    cache.conn = null;
    throw error;
  }

  return cache.conn;
}
