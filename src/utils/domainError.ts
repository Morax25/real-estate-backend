import { HttpCode, type HttpCodeValue } from './statusCode.ts';

export type DomainErrorCode =
  | 'NOT_FOUND'
  | 'ALREADY_EXISTS'
  | 'INVALID_STATE'
  | 'OPERATION_NOT_ALLOWED'
  | 'VALIDATION_FAILED'
  | 'CONFLICT';

const domainToHttpMap: Record<DomainErrorCode, HttpCodeValue> = {
  NOT_FOUND: HttpCode.NOT_FOUND,
  ALREADY_EXISTS: HttpCode.CONFLICT,
  INVALID_STATE: HttpCode.BAD_REQUEST,
  OPERATION_NOT_ALLOWED: HttpCode.FORBIDDEN,
  VALIDATION_FAILED: HttpCode.UNPROCESSABLE,
  CONFLICT: HttpCode.CONFLICT,
};

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly httpCode: HttpCodeValue;
  readonly isOperational = true;
  readonly details?: unknown;
  readonly timestamp: string;

  constructor(code: DomainErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.httpCode = domainToHttpMap[code];
    this.details = details;
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      httpCode: this.httpCode,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}
