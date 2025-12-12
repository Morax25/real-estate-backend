import ApiResponse from '../utils/ApiResponse.ts';
import asyncHandler from '../utils/asyncHandler.ts';

export const notFoundHandler = asyncHandler(async (req, res) => {
  const response = new ApiResponse({
    statusCode: 404,
    message: 'The requested API endpoint does not exist.',
    data: {
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    },
  });
  res.status(response.statusCode).json(response);
});
