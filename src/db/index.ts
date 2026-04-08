import mongoose from 'mongoose';
import { DB_NAME, MONGODB_URI } from '../constant.js';

const connectDB = async () => {
  if (!DB_NAME || !MONGODB_URI) {
    throw new Error('Missing DB_NAME or MONGODB_URI env variable');
  }
  if (mongoose.connection.readyState === 1) {
    console.log('✅ Already connected to MongoDB');
    return mongoose.connection;
  }
  try {
    const startTime = Date.now();
    const connection = await mongoose.connect(
      `${MONGODB_URI.replace(/\/$/, '')}/${DB_NAME}?retryWrites=true&w=majority`,
      {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        family: 4,
        retryWrites: true,
        w: 'majority',
        maxPoolSize: 10,
        minPoolSize: 2,
      }
    );
    const duration = Date.now() - startTime;
    console.log(`✅ MongoDB connected in ${duration}ms`);
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
    return connection;
  } catch (err) {
    console.error(
      '❌ MongoDB connection failed:',
      err instanceof Error ? err.message : err
    );
    throw err;
  }
};

export default connectDB;
