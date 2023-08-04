import { ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggerInterceptor } from '@interceptors/interceptor.logger';
import { TransformInterceptor } from '@interceptors/interceptor.transform';
import { HttpExceptionFilter } from '@utils/exception.filter';

export const providers = [
  {
    provide: APP_INTERCEPTOR,
    useClass: TransformInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggerInterceptor,
  },
  {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  },
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
];
