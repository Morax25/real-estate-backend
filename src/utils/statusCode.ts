export const HttpCode = {
  // 200 CODE
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // 400 CODE
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,

  // 500 CODE
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpCodeValue = typeof HttpCode[keyof typeof HttpCode];
export type HttpCodeKey = keyof typeof HttpCode;