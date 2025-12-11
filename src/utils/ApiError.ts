import type { ApiErrorProps } from './utils.types.ts';

class ApiError extends Error {
  statusCode: number;
  errors: any[];
  data: null;
  success: boolean;
  constructor({
    statusCode,
    message = 'Something went wrong : local',
    errors = [],
    stack = '',
  }: ApiErrorProps) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.data = null;
    this.success = false;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
