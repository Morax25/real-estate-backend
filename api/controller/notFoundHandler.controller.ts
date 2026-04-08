import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HttpCode } from '../utils/statusCode.js';

export const notFoundHandler = asyncHandler(async (req, res) => {
  const response = new ApiResponse({
    message: 'The requested API endpoint does not exist.',
    data: {
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    },
  });
  res.status(HttpCode.NOT_FOUND).json(response);
});
