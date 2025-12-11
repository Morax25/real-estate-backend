import type { Request, Response } from 'express';
import ApiResponse from '../utils/ApiResponse.ts';

export const notFoundHandler = (req: Request, res: Response): void => {
  const response = new ApiResponse({
    statusCode: 404,
    message: 'Route not found',
    data: null,
  });

  res.status(response.statusCode).json(response);
};