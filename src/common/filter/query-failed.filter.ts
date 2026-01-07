import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let message = '데이터베이스 에러가 발생했습니다.';
    let statusCode = 400;

    // Handle specific database errors
    if (exception.message.includes('duplicate key')) {
      message = '중복된 데이터가 존재합니다.';
      statusCode = 409;
    } else if (exception.message.includes('violates foreign key')) {
      message = '참조하는 데이터가 존재하지 않습니다.';
      statusCode = 400;
    } else if (exception.message.includes('violates not-null')) {
      message = '필수 데이터가 누락되었습니다.';
      statusCode = 400;
    }

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
