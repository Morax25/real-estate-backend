import type { RateLimitRequestHandler } from 'express-rate-limit';
import rateLimit from 'express-rate-limit';
import type { Request } from 'express';

const ROLE_LIMITS: Record<string, { windowMs: number; max: number }> = {
  admin: { windowMs: 60 * 1000, max: 1000 }, // 1 min, 1000 req
  agent: { windowMs: 60 * 1000, max: 300 }, // 1 min, 300 req
  user: { windowMs: 60 * 1000, max: 100 }, // 1 min, 100 req
  guest: { windowMs: 15 * 60 * 1000, max: 50 }, // 15 min, 50 req
};

export const getRateLimiter = (
  role: string = 'guest'
): RateLimitRequestHandler => {
  const { windowMs, max } = ROLE_LIMITS[role] || ROLE_LIMITS['guest'];

  return rateLimit({
    windowMs,
    max,
    keyGenerator: (req: Request) => req.user?.id || req.ip,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 429,
      message: 'Too many requests. Please try again later.',
    },
  });
};
