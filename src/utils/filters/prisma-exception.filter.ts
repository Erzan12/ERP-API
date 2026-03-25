import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter<Prisma.PrismaClientKnownRequestError> {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        const uniqueField = exception.meta?.target as string | undefined;

        message = uniqueField
          ? `Unique constraint failed on ${uniqueField}`
          : `Unique key constraint failed`;
        break;
      }

      case 'P2003': {
        status = HttpStatus.BAD_REQUEST;
        const field = exception.meta?.field_name as string | undefined;

        message = field
          ? `Foreign key constraint failed on field ${field}`
          : `Foreign key constraint failed`;
        break;
      }

      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = `Record not found`;
        break;
      }

      case 'P2014': {
        status = HttpStatus.BAD_REQUEST;
        message = `Database operation violates a required relation between two models`;
        break;
      }

      case 'P2000': {
        status = HttpStatus.BAD_REQUEST;
        message = `The provided value for the column is too long for the column's type.`;
        break;
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.code,
    });
  }
}
