import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import ApiError from './ApiError.ts';
import { DomainError } from './domainError.ts';

const mapDomainStatus = (code: string): number => {
  switch (code) {
    case 'NOT_FOUND':
      return 404;
    case 'ALREADY_EXISTS':
      return 409;
    case 'VALIDATION_FAILED':
      return 400;
    case 'INVALID_STATE':
      return 400;
    case 'OPERATION_NOT_ALLOWED':
      return 403;
    case 'CONFLICT':
      return 409;
    default:
      return 400;
  }
};

const isDuplicateKeyError = (
  err: unknown
): err is mongoose.mongo.MongoServerError => {
  return (
    err instanceof mongoose.mongo.MongoServerError &&
    err.code === 11000
  );
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let status = 500;
  let message = 'Internal Server Error';
  let errors: unknown = undefined;

  if (err instanceof ApiError) {
    status = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof DomainError) {
    status = mapDomainStatus(err.code);
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
  }

  if (status >= 500) {
    console.error('Unhandled error:', err);
  }

  return res.status(status).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' &&
      status >= 500 && { stack: (err as Error).stack }),
  });
};