import mongoose from 'mongoose';
import { DB_NAME, MONGODB_URI } from '../constant.js';

const connectDB = async () => {
  console.log(DB_NAME, MONGODB_URI);
  try {
    const connection = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}?retryWrites=true&w=majority`
    );

    console.log('MongoDB connected');
    return connection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

export default connectDB;
