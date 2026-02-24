import ApiResponse from '../utils/ApiResponse.ts';
import asyncHandler from '../utils/asyncHandler.ts';
import { HttpCode } from '../utils/statusCode.ts';

export const login = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
        return res
      .status(HttpCode.BAD_REQUEST)
      .json(
        new ApiResponse({
          message: 'User not found',
          data: {},
        })
      );
  }
  res.status(HttpCode.OK).json(
    new ApiResponse({
      message: `User found`,
      data: { data: name },
    })
  );
});
