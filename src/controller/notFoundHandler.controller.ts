import type { Request, Response } from 'express';
import ApiResponse from '../utils/ApiResponse.ts';

export const notFoundHandler = (req: Request, res: Response): void => {
  const response = new ApiResponse({
    statusCode: 404,
    message: 'The requested API endpoint does not exist.',
    data: {
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    },
  });
  res.status(response.statusCode).json(response);
};
