import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;
const DB_NAME = process.env.DB_NAME as string;

if (!MONGODB_URI || !DB_NAME) {
  throw new Error('Missing MONGODB_URI or DB_NAME');
}

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var _mongoose: MongooseCache | undefined;
}

const globalCache = globalThis as typeof globalThis & {
  _mongoose?: MongooseCache;
};

if (!globalCache._mongoose) {
  globalCache._mongoose = {
    conn: null,
    promise: null,
  };
}

const connectDB = async (): Promise<Mongoose> => {
  if (globalCache._mongoose!.conn) {
    return globalCache._mongoose!.conn;
  }

  if (!globalCache._mongoose!.promise) {
    const uri = `${MONGODB_URI.replace(/\/$/, '')}/${DB_NAME}`;

    globalCache._mongoose!.promise = mongoose.connect(uri, {
      bufferCommands: false,
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 60000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 60000,
      retryWrites: true,
      w: 'majority',
    });
  }

  try {
    globalCache._mongoose!.conn = await globalCache._mongoose!.promise;
    return globalCache._mongoose!.conn;
  } catch (err) {
    globalCache._mongoose!.promise = null;
    throw err;
  }
};

export default connectDB;
