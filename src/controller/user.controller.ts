import ApiResponse from '../utils/ApiResponse.ts';
import asyncHandler from '../utils/asyncHandler.ts';

export const login = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
        return res
      .status(400)
      .json(
        new ApiResponse({
          statusCode: 400,
          message: 'Please provide the name',
          data: { name: 'adarsj' },
        })
      );
  }
  res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: `User name is ${name}`,
      data: { data: null },
    })
  );
});
