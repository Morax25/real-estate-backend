import mongoose from 'mongoose';
import { DB_NAME, MONGODB_URI } from '../constant.js';

let cachedConnection: typeof mongoose | null = null;

const connectDB = async () => {
  if (!DB_NAME || !MONGODB_URI) {
    throw new Error('Missing DB_NAME or MONGODB_URI env variable');
  }

  // Return cached connection if it's still valid
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('✅ Using cached connection');
    return cachedConnection;
  }

  const connectionString = `${MONGODB_URI.replace(/\/$/, '')}/${DB_NAME}?retryWrites=true&w=majority`;

  try {
    console.log('🔄 Creating new MongoDB connection...');
    const startTime = Date.now();

    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 15000,
      family: 4,
      maxPoolSize: 3,
      minPoolSize: 1,
      maxIdleTimeMS: 60000,
      retryWrites: true,
      w: 'majority',
      heartbeatFrequencyMS: 30000,
    });

    const duration = Date.now() - startTime;
    console.log(`✅ MongoDB connected in ${duration}ms`);

    cachedConnection = mongoose;

    mongoose.connection.on('error', (err) => {
      console.error('❌ Connection error:', err.message);
      cachedConnection = null;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ Disconnected');
      cachedConnection = null;
    });

    return mongoose.connection;
  } catch (err) {
    console.error(
      '❌ Connection failed:',
      err instanceof Error ? err.message : err
    );
    cachedConnection = null;
    throw err;
  }
};

export default connectDB;
