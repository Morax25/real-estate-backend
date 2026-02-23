import type { HttpCodeValue } from "./statusCode.ts";
export interface ApiErrorProps {
  statusCode: HttpCodeValue;
  message?: string;
  errors?: any[];
  stack?: string;
}
export interface ApiResponseProps<T = any> {
  statusCode: HttpCodeValue;
  message?: string;
  data?: T;
}