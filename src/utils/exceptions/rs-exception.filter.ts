import {
  ArgumentMetadata,
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RsException } from './rs-exception';
import { PrimsaFriendlyErrorMessage } from './rs-prisma-exeption';

@Catch()
export class RsExceptionFilter implements PipeTransform<any>, ExceptionFilter {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = this.getErrorMessage(errors);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: messages,
        status: 400,
      });
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private getErrorMessage(errors: any): Record<string, any> {
    const result: Record<string, any> = {};
    errors.forEach((error) => {
      const constraints = error.constraints;
      if (constraints) {
        const property = error.property;
        result[property] = Object.values(constraints);
      }
    });

    return result;
  }
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let exceptionResponse;

    const responseData = {
      name: 'DEFAULT',
      message:
        'Our server is not happy. It threw an error. Please try again or contact support.' ||
        {},
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      group: '',
      meta: null,
      timestamp: new Date().getTime(),
    };

    function isObjectWithErrors(value: any): value is { errors: any[] } {
      return typeof value === 'object' && value !== null && 'errors' in value;
    }

    if (exception instanceof HttpException) {
      exceptionResponse = exception?.getResponse();

      if (isObjectWithErrors(exceptionResponse)) {
        responseData.meta = exceptionResponse?.errors ?? '';
      } else {
        responseData.meta = [response?.errors ?? ''];
      }
      responseData.name = exception.name;
      responseData.statusCode = exception.getStatus();
      responseData.message = exception.message;
      responseData.group = 'HTTP';
    } else if (exception instanceof RsException) {
      // exceptionResponse = exception?.getResponse();

      if (isObjectWithErrors(exceptionResponse)) {
        responseData.meta = exceptionResponse?.errors ?? '';
      } else {
        responseData.meta = [response?.errors ?? ''];
      }
      responseData.message = exception.message;
      responseData.statusCode = exception.httpCode;
      responseData.name = exception.name;
      responseData.group = exception.group;
    } else if (exception instanceof Prisma?.PrismaClientKnownRequestError) {
      responseData.name = exception.code;
      //responseData.meta = exception.meta;
      const prismaError = PrimsaFriendlyErrorMessage(exception);
      responseData.message = prismaError.message;
      responseData.statusCode = prismaError.httpCode;
      responseData.group = 'DBERROR';
    } else if (exception instanceof Error) {
      responseData.name = exception.name;
      responseData.message = exception.message;
    } else if (typeof exception === 'string') {
      responseData.message = exception;
    }

    response.status(responseData.statusCode).json(responseData);
  }
}
