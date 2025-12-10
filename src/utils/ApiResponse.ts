import type { ApiResponseProps } from "./utils.types.js";

class ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;

  constructor({ statusCode, message = 'Success', data }: ApiResponseProps<T>) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data as T;
  }
}

export default ApiResponse;
