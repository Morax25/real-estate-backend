import { createUser, userLogin } from '../services/user.service.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HttpCode } from '../utils/statusCode.js';

export const login = asyncHandler(async (req, res) => {
  const user = await userLogin(req.body);
  if (!user) {
    throw new ApiError({
      statusCode: HttpCode.UNAUTHORIZED,
      message: 'Invalid credentials',
    });
  }
  res.status(HttpCode.OK).json(
    new ApiResponse({
      message: `Login successful`,
      data: user,
    })
  );
});

export const signUp = asyncHandler(async (req, res) => {
  const user = await createUser(req.body);
  if (!user) {
    throw new ApiError({
      statusCode: HttpCode.INTERNAL_SERVER_ERROR,
      message: 'User registration failed',
    });
  }
  res.status(HttpCode.OK).json(
    new ApiResponse({
      message: `Registration successful`,
      data: user,
    })
  );
});
