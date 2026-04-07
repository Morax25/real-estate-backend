// src/configs/rateLimiter.ts
import type { RateLimitRequestHandler } from 'express-rate-limit';
import rateLimit from 'express-rate-limit';

const ROLE_LIMITS: Record<string, { windowMs: number; max: number }> = {
  admin: { windowMs: 60 * 1000, max: 1000 },
  agent: { windowMs: 60 * 1000, max: 300 },
  user: { windowMs: 60 * 1000, max: 100 },
  guest: { windowMs: 15 * 60 * 1000, max: 50 },
};

export const getRateLimiter = (
  role: string = 'guest'
): RateLimitRequestHandler => {
  const roleConfig = (ROLE_LIMITS[role] ?? ROLE_LIMITS['guest']) as {
    windowMs: number;
    max: number;
  };
  const { windowMs, max } = roleConfig;

  return rateLimit({
    windowMs,
    max,
    keyGenerator: (req) => req.user?._id?.toString() ?? req.ip ?? 'unknown',
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 429,
      message: 'Too many requests. Please try again later.',
    },
  });
};
