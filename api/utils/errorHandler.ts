import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import mongoose from 'mongoose';
import { logger } from '../configs/logger.js';
import ApiError from './ApiError.js';
import { DomainError } from './domainError.js';

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

  const logPayload = {
    message,
    status,
    path: req.originalUrl,
    method: req.method,
    requestId: req.headers['x-request-id'],
    error: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : undefined,
  };

  if (status >= 500) {
    logger.error(logPayload);
  } else {
    logger.warn(logPayload);
  }

  return res.status(status).json({
    success: false,
    message,
    ...(errors !== undefined && { errors }),
    ...(!isProduction && status >= 500 && { stack: logPayload.stack }),
  });
};

process.on('unhandledRejection', (err: unknown) => {
  logger.error({
    message: 'Unhandled rejection — shutting down',
    error: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : undefined,
    timestamp: new Date().toISOString(),
  });

  setTimeout(() => process.exit(1), 1000);
});

process.on('uncaughtException', (err: Error) => {
  logger.error({
    message: 'Uncaught exception — shutting down',
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  setTimeout(() => process.exit(1), 1000);
});
