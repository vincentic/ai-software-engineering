export class ApiResponse<T> {
  code: number;
  data: T | null;
  message: string;

  constructor(code: number, data: T | null, message: string) {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse<T>(200, data, 'success');
  }

  static error<T = null>(message: string, code = 500): ApiResponse<T> {
    return new ApiResponse<T>(code, null, message);
  }
}
