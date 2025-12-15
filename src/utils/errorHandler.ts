import type { ErrorRequestHandler } from 'express';
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

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('🔥 Error caught:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof DomainError) {
    return res.status(mapDomainStatus(err.code)).json({
      success: false,
      message: err.message,
      errors: err.details,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    stack:
      process.env.NODE_ENV === 'development'
        ? (err as Error).stack
        : undefined,
  });
};
