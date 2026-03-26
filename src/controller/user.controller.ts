import ApiResponse from '../utils/ApiResponse.ts';
import asyncHandler from '../utils/asyncHandler.ts';
import { HttpCode } from '../utils/statusCode.ts';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)
  res.status(HttpCode.OK).json(
    new ApiResponse({
      message: `User found`,
      data: { data: email },
    })
  );
});

export const signUp = asyncHandler(async(req, res)=>{
   const {name, email, password} = req.body
   console.log(name, email, password)
     res.status(HttpCode.OK).json(
    new ApiResponse({
      message: `User found`,
      data: {name:name, data: email },
    })
  );
})
