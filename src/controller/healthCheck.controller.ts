import ApiResponse from '../utils/ApiResponse.ts';
import asyncHandler from '../utils/asyncHandler.ts';

export const healthCheck = asyncHandler(async (req, res) => {
  const response = new ApiResponse({
    statusCode: 200,
    message: 'Server is healthy',
    data: {
      uptime: process.uptime(),
      timestamp: Date.now(),
      environment: process.env.NODE_ENV,
    },
  });

  res.status(response.statusCode).json(response);
});
