import mongoose from 'mongoose';
import { DB_NAME, MONGODB_URI } from '../constant.ts';

const connectDB = async () => {
  const connectionInstance = await mongoose.connect(
    `${MONGODB_URI}/${DB_NAME}`
  );

  return connectionInstance;
};

export default connectDB;