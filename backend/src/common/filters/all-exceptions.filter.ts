import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const resBody = isHttp ? exception.getResponse() : undefined;

    let message: string | string[] =
      typeof resBody === 'string'
        ? resBody
        : (resBody as any)?.message ?? (exception as Error).message ?? 'Internal server error';

    if (Array.isArray(message)) {
      message = message.join(', ');
    }

    const error = typeof resBody === 'object' && resBody !== null ? (resBody as any).error : undefined;

    response.status(status).json({
      statusCode: status,
      message,
      error: error ?? (isHttp ? exception.name : 'InternalServerError'),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
