import type { ApiErrorProps } from './utils.types.ts';

class ApiError extends Error {
  statusCode: number;
  errors: unknown[];
  success: boolean;
  isOperational: boolean;

  constructor({
    statusCode,
    message = 'Something went wrong',
    errors = [],
    isOperational = true,
  }: ApiErrorProps & { isOperational?: boolean }) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
