import mongoose from 'mongoose';
import { DB_NAME, MONGODB_URI } from '../constant.js';

const connectDB = async () => {
  console.log('connectDB() called');
  console.log('DB_NAME:', DB_NAME);
  console.log('MONGODB_URI exists:', !!MONGODB_URI);
  console.log('Initial readyState:', mongoose.connection.readyState);

  if (!DB_NAME || !MONGODB_URI) {
    throw new Error('Missing DB_NAME or MONGODB_URI env variable');
  }

  if (mongoose.connection.readyState === 1) {
    console.log('✅ Already connected');
    return mongoose.connection;
  }

  const connectionString = `${MONGODB_URI.replace(/\/$/, '')}/${DB_NAME}?retryWrites=true&w=majority`;
  console.log(
    'Connection string (masked):',
    connectionString.replace(/:[^:/@]+@/, ':***@')
  );

  try {
    console.log('🔄 About to call mongoose.connect()...');
    const startTime = Date.now();

    const connection = await mongoose.connect(connectionString, {
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
    console.log(`✅ mongoose.connect() resolved after ${duration}ms`);
    console.log('readyState after connect:', mongoose.connection.readyState);

    mongoose.connection.on('error', (err) => {
      console.error('❌ Connection error event:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ Disconnected event fired');
    });

    return connection;
  } catch (err) {
    console.error('❌ mongoose.connect() threw error');
    console.error(
      'Error type:',
      err instanceof Error ? err.constructor.name : typeof err
    );
    console.error('Error message:', err instanceof Error ? err.message : err);
    throw err;
  }
};

export default connectDB;
