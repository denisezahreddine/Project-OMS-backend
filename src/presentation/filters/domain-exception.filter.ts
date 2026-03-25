import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomErrorException } from '../../domain/exceptions/custom.error.exceptions';

@Catch(CustomErrorException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: CustomErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;

    if (exception.name === 'EntityNotFoundException') {
      status = HttpStatus.NOT_FOUND;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
      error: exception.name,
    });
  }
}
