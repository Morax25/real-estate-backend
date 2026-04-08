import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { corsConfig } from './configs/cors.js';
import { loggerStream } from './configs/logger.js';
import { DB_NAME, MONGODB_URI } from './constant.js';
import { healthCheck } from './controller/healthCheck.controller.js';
import { notFoundHandler } from './controller/notFoundHandler.controller.js';
import propertyRouter from './routes/property.routes.js';
import userRouter from './routes/user.routes.js';
import { errorHandler } from './utils/errorHandler.js';

const app = express();

app.use(cors(corsConfig));
app.use(morgan('combined', { stream: loggerStream }));

//middlewares
app.use(compression());
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

//Upcoming Routes section
app.get('/health', healthCheck);

// Test connection endpoint
app.get('/api/test-connection', async (req, res) => {
  try {
    console.log('🔄 Testing connection...');
    console.log('MONGODB_URI exists:', !!MONGODB_URI);
    console.log('DB_NAME:', DB_NAME);

    if (mongoose.connection.readyState === 1) {
      return res.json({
        status: 'already connected',
        readyState: mongoose.connection.readyState,
      });
    }

    const testUrl = `${MONGODB_URI}/${DB_NAME}?retryWrites=true&w=majority`;
    console.log(
      'Connection URL (masked):',
      testUrl.replace(/:[^:/@]+@/, ':***@')
    );

    console.log('🔄 Calling mongoose.connect()...');
    await mongoose.connect(testUrl, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Connected');
    res.json({
      status: 'connected',
      readyState: mongoose.connection.readyState,
    });
  } catch (err) {
    const error = err as Error;
    console.error('❌ Error message:', error.message);
    console.error('❌ Error name:', error.name);

    res.status(500).json({
      error: error.message || 'Unknown error',
      name: error.name,
    });
  }
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/property', propertyRouter);

// 404 fallback
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
