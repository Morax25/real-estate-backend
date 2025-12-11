import type { ErrorRequestHandler } from 'express';
import ApiError from './ApiError.ts';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error('🔥 Error caught:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  const statusCode = 500;
  const response = {
    success: false,
    message: 'Internal Server Error',
    stack:
      process.env.NODE_ENV === 'development' ? (err as Error).stack : undefined,
  };

  return res.status(statusCode).json(response);
};
