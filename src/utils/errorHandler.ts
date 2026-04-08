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

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_VERCEL = process.env.VERCEL === '1';

function normalise(err: unknown): {
  status: number;
  message: string;
  errors?: unknown;
  isOperational: boolean;
} {
  if (err instanceof ApiError) {
    return {
      status: err.statusCode,
      message: err.message,
      errors: err.errors.length ? err.errors : undefined,
      isOperational: err.isOperational,
    };
  }

  if (err instanceof DomainError) {
    return {
      status: err.httpCode,
      message: err.message,
      errors: err.details,
      isOperational: true,
    };
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return {
      status: 400,
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e) => e.message),
      isOperational: true,
    };
  }

  if (err instanceof mongoose.Error.CastError) {
    return {
      status: 400,
      message: `Invalid ${err.path}: ${err.value}`,
      isOperational: true,
    };
  }

  if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
    return {
      status: 409,
      message: 'Duplicate key error',
      errors: err.keyValue,
      isOperational: true,
    };
  }

  return {
    status: 500,
    message: IS_PRODUCTION
      ? 'Internal Server Error'
      : err instanceof Error
        ? err.message
        : String(err),
    isOperational: false,
  };
}

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { status, message, errors, isOperational } = normalise(err);

  const logPayload = {
    status,
    message,
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

  if (res.headersSent) return;

  res.status(status).json({
    success: false,
    message,
    ...(errors !== undefined && { errors }),
    ...(!IS_PRODUCTION && !isOperational && { stack: logPayload.stack }),
  });
};

// Only exit process on a real persistent server, never on Vercel
process.on('unhandledRejection', (reason: unknown) => {
  logger.error({
    message: 'Unhandled promise rejection',
    error: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
  });

  if (!IS_VERCEL) {
    setTimeout(() => process.exit(1), 1000);
  }
});

process.on('uncaughtException', (err: Error) => {
  logger.error({
    message: 'Uncaught exception',
    error: err.message,
    stack: err.stack,
  });

  if (!IS_VERCEL) {
    setTimeout(() => process.exit(1), 1000);
  }
});
