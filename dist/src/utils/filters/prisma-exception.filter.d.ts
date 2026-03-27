import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
export declare class PrismaExceptionFilter implements ExceptionFilter<Prisma.PrismaClientKnownRequestError> {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void;
}
