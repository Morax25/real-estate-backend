import { createUser, userLogin } from '../services/user.service.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HttpCode } from '../utils/statusCode.js';

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await userLogin(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });
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
