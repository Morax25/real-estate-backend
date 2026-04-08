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
  return global._mongoose;
}

export async function connectDB() {
  const cache = getCache();

  if (cache.conn) {
    console.log('✅ Using cached DB connection');
    return cache.conn;
  }

  if (!cache.promise) {
    console.log('⚡ Creating new DB connection...');
    cache.promise = mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      maxIdleTimeMS: 10000, // ← closes idle sockets before Vercel kills them
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000, // ← lowered from 30000, must be < function maxDuration
      maxPoolSize: 3,
    });
  }

  try {
    cache.conn = await cache.promise;

    // ✅ THE critical fix — stops the MongoDB TCP socket from keeping
    // the Node event loop alive after a response is sent.
    // Without this, Vercel sees the event loop is still active and
    // waits until maxDuration (30s) before killing the function.
    (mongoose.connection.getClient() as any).topology?.unref?.();

    console.log('✅ DB connected successfully');
  } catch (error) {
    console.error('❌ DB connection failed:', error);
    cache.promise = null;
    cache.conn = null;
    throw error;
  }

  return cache.conn;
}
