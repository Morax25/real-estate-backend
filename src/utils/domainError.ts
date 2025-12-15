export type DomainErrorCode =
  | 'NOT_FOUND'
  | 'ALREADY_EXISTS'
  | 'INVALID_STATE'
  | 'OPERATION_NOT_ALLOWED'
  | 'VALIDATION_FAILED'
  | 'CONFLICT';

export abstract class DomainError extends Error {
  abstract readonly code: DomainErrorCode;
  readonly isOperational = true;
  readonly details?: unknown;

  protected constructor(message: string, details?: unknown) {
    super(message);
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND';

  constructor(resource: string, details?: unknown) {
    super(`${resource} not found`, details);
  }
}

export class AlreadyExistsError extends DomainError {
  readonly code = 'ALREADY_EXISTS';

  constructor(resource: string, details?: unknown) {
    super(`${resource} already exists`, details);
  }
}

export class InvalidStateError extends DomainError {
  readonly code = 'INVALID_STATE';

  constructor(message: string, details?: unknown) {
    super(message, details);
  }
}

export class OperationNotAllowedError extends DomainError {
  readonly code = 'OPERATION_NOT_ALLOWED';

  constructor(message: string, details?: unknown) {
    super(message, details);
  }
}

export class ConflictError extends DomainError {
  readonly code = 'CONFLICT';

  constructor(message: string, details?: unknown) {
    super(message, details);
  }
}

export class DomainValidationError extends DomainError {
  readonly code = 'VALIDATION_FAILED';

  constructor(message: string, details?: Record<string, string[]>) {
    super(message, details);
  }
}
