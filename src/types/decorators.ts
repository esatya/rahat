import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export const AppId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['appid'];
  },
);

export function ResponseHandler(): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]): Promise<any> {
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        const message = 'An unknown error occurred';
        const status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (status >= 500) {
          console.error(error);
        }

        throw new HttpException(
          {
            success: false,
            status,
            message,
            source: propertyKey,
          },
          status,
        );
      }
    };

    return descriptor;
  };
}
