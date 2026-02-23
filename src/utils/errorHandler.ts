import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
import mongoose from 'mongoose';
import ApiError from './ApiError.ts';
import { DomainError } from './domainError.ts';
import { logger } from '../configs/logger.ts';

const isDuplicateKeyError = (
  err: unknown
): err is mongoose.mongo.MongoServerError => {
  return err instanceof mongoose.mongo.MongoServerError && err.code === 11000;
};

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let status = 500;
  let message = 'Internal Server Error';
  let errors: unknown = undefined;

  if (err instanceof ApiError) {
    status = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof DomainError) {
    status = err.httpCode;
    message = err.message;
    errors = err.details;
  } else if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => e.message);
  } else if (isDuplicateKeyError(err)) {
    status = 409;
    message = 'Duplicate key error';
    errors = err.keyValue;
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  const isProduction = process.env.NODE_ENV === 'production';

  if (status >= 500) {
    logger.error('Unhandled error', {
      error: (err as Error).message,
      requestId: req.headers['x-request-id'],
      path: req.path,
      method: req.method,
      stack: (err as Error).stack,
    });
  }

  return res.status(status).json({
    success: false,
    message,
    ...(errors !== undefined && { errors }),
    ...(!isProduction && status >= 500 && { stack: (err as Error).stack }),
  });
};

process.on('unhandledRejection', (err: unknown) => {
  if (err instanceof DomainError && err.isOperational) return;

  logger.error('Unhandled rejection — shutting down', {
    error: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : undefined,
    timestamp: new Date().toISOString(),
  });

  logger.once('finish', () => process.exit(1));
  logger.end();
});

process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught exception — shutting down', {
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  logger.on('finish', () => process.exit(1));
  logger.end();
});