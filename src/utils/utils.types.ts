export interface ApiErrorProps {
  statusCode: number;
  message?: string;
  errors?: any[];
  stack?: string;
}

export interface ApiResponseProps<T = any> {
  statusCode: number;
  message?: string;
  data?: T;
}
