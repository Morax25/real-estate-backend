import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME!;

// ✅ Prevent mongoose from buffering (CRITICAL for serverless)
mongoose.set('bufferCommands', false);

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
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

  // ✅ Reuse existing connection
  if (cache.conn) {
    return cache.conn;
  }

  // ✅ Create connection promise once
  if (!cache.promise) {
    console.log('⚡ Creating new DB connection...');

    cache.promise = mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,

      // ✅ tuned for serverless (fast fail)
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,

      // ✅ small pool for lambda
      maxPoolSize: 3,

      // optional but helpful
      family: 4, // force IPv4 (fixes DNS delays sometimes)
    });
  }

  try {
    cache.conn = await cache.promise;

    console.log('✅ DB connected');

    // ✅ Debug (you can remove later)
    console.log('readyState:', mongoose.connection.readyState);
    console.log('host:', mongoose.connection.host);
  } catch (error) {
    console.error('❌ DB connection failed:', error);

    cache.promise = null;
    cache.conn = null;

    throw error;
  }

  return cache.conn;
}
