import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME!;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached!.conn) {
    console.log('✅ Using cached DB connection');
    return cached!.conn;
  }

  if (!cached!.promise) {
    console.log('⚡ Creating new DB connection...');

    cached!.promise = mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      bufferCommands: false,

      // 🔥 critical for Vercel
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,

      maxPoolSize: 5,
    });
  }

  try {
    cached!.conn = await cached!.promise;
    console.log('✅ DB connected successfully');
  } catch (error) {
    console.error('❌ DB connection failed:', error);
    cached!.promise = null;
    cached!.conn = null;
    throw error;
  }

  return cached!.conn;
}
