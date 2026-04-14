import { uploadFilesService } from '../services/upload.service.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HttpCode } from '../utils/statusCode.js';

export const uploadFilesController = asyncHandler(async (req, res) => {
  if (!req.files || !Array.isArray(req.files)) {
    throw new ApiError({
      statusCode: HttpCode.BAD_REQUEST,
      message: 'No files uploaded',
    });
  }

  const files = req.files;

  const result = await uploadFilesService(files);

  return res.status(result.failedCount ? 207 : HttpCode.OK).json(
    new ApiResponse({
      message: result.failedCount
        ? 'Some files failed to upload'
        : 'Files uploaded successfully',
      data: result,
    })
  );
});
