import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { corsConfig } from './configs/cors.js';
import { loggerStream } from './configs/logger.js';
import { healthCheck } from './controller/healthCheck.controller.js';
import { notFoundHandler } from './controller/notFoundHandler.controller.js';
import { connectDB } from './db/index.js';
import propertyRouter from './routes/property.routes.js';
import userRouter from './routes/user.routes.js';
import { errorHandler } from './utils/errorHandler.js';

const app = express();

// ─── Security & parsing ──────────────────────────────────────────────────────
app.use(cors(corsConfig));
app.use(compression());
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(morgan('combined', { stream: loggerStream }));

// ─── DB middleware — every request waits for connection ──────────────────────
// DB middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err); // ← was res.status(500).json(...), now flows through errorHandler
  }
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/health', healthCheck);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/property', propertyRouter);

// ─── 404 → error pipeline ────────────────────────────────────────────────────
app.use(notFoundHandler);

// ─── Global error handler — must be last ────────────────────────────────────
app.use(errorHandler);

export default app;
