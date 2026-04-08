import mongoose from 'mongoose';
import { DB_NAME, MONGODB_URI } from '../constant.js';

const connectDB = async () => {
  console.log('DB_NAME:', DB_NAME, 'MONGODB_URI:', MONGODB_URI);

  if (!DB_NAME || !MONGODB_URI) {
    throw new Error('Missing DB_NAME or MONGODB_URI env variable');
  }

  try {
    console.log('🔄 Starting mongoose.connect()...');

    const startTime = Date.now();

    const connection = await mongoose.connect(
      `${MONGODB_URI.replace(/\/$/, '')}/${DB_NAME}?retryWrites=true&w=majority`,
      {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }
    );

    const duration = Date.now() - startTime;
    console.log(`✅ MongoDB connected in ${duration}ms`);
    return connection;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
};

export default connectDB;
