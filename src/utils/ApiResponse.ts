export class ApiResponse<T> {
  data: T;
  message?: string;
  code: number;

  constructor(data: T, message?: string, code = 0) {
    this.data = data;
    this.message = message;
    this.code = code;
  }

  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse<T>(data, "Success", 0);
  }

  static successWithoutData<T>(): ApiResponse<T> {
    return new ApiResponse<T>(null, "Success", 0);
  }

  static error<T>(msg: string, code = 1000): ApiResponse<T> {
    return new ApiResponse<T>(null, msg, code);
  }

  static needLogin<T>(): ApiResponse<T> {
    return new ApiResponse<T>(null, "请先登录", 1010);
  }
}
