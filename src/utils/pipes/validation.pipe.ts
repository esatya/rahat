import {
  ArgumentMetadata,
  ArgumentsHost,
  BadRequestException,
  HttpException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
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
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    response.status(status).json({
      message: 'An error occurred',
      errors: exception.message.errors || [exception.message],
      status,
    });
  }
}
