import { HttpException } from '@nestjs/common';

export class Response {
  static success<T>(data: T, message: string) {
    return {
      code: 200,
      message: message,
      payload: data,
    };
  }

  static error(message: string, code: number) {
    throw new HttpException(
      {
        code: code,
        message: message,
      },
      code,
      {
        cause: new Error(message),
      },
    );
  }
}
