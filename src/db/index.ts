import mongoose from 'mongoose';
import { DB_NAME, MONGODB_URI } from '../constant.js';

const connectDB = async () => {
  console.log('DB_NAME:', DB_NAME, 'MONGODB_URI:', MONGODB_URI);

  if (!DB_NAME || !MONGODB_URI) {
    throw new Error('Missing DB_NAME or MONGODB_URI env variable');
  }

  mongoose.set('bufferCommands', false);

  try {
    const connection = await mongoose.connect(
      `${MONGODB_URI.replace(/\/$/, '')}/${DB_NAME}`,
      {
        serverSelectionTimeoutMS: 5000, // fail fast
      }
    );
    console.log('MongoDB connected');
    return connection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // stop server if DB cannot connect
  }
};

export default connectDB;
