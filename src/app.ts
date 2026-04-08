import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { corsConfig } from './configs/cors.js';
import { loggerStream } from './configs/logger.js';
import { healthCheck } from './controller/healthCheck.controller.js';
import { notFoundHandler } from './controller/notFoundHandler.controller.js';
import { Property } from './models/property.model.js';
import propertyRouter from './routes/property.routes.js';
import userRouter from './routes/user.routes.js';
import { errorHandler } from './utils/errorHandler.js';

const app = express();

app.use(cors(corsConfig));
// ✅ immediate: true — don't hold the event loop open after response
app.use(morgan('combined', { stream: loggerStream, immediate: true }));

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
// ✅ compression removed — Vercel CDN handles this at the edge

console.log('mongoose ready:', mongoose.connection.readyState);
console.log('model ready:', Property.db.readyState);

app.get('/health', healthCheck);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/property', propertyRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
