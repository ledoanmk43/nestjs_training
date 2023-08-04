import { BE_PORT } from '@common/app.constants';
import { CorsOptions } from '@configs/config.cors';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors(CorsOptions);
  await app.listen(configService.get<string>(BE_PORT));
  Logger.log(
    'App is running at: http://localhost:' + configService.get<string>(BE_PORT),
  );
}
bootstrap();
