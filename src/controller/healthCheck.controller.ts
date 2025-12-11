import type { Request, Response } from "express";
import ApiResponse from "../utils/ApiResponse.ts";

export const healthCheck = (req: Request, res: Response) => {
  const response = new ApiResponse({
    statusCode: 200,
    message: "Server is healthy",
    data: {
      uptime: process.uptime(),
      timestamp: Date.now(),
      environment: process.env.NODE_ENV,
    },
  });

  return res.status(response.statusCode).json(response);
};
