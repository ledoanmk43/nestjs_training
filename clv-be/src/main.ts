import { PORT } from '@common/app.constants';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  await app.listen(configService.get<string>(PORT));
  Logger.log(
    'App is running at: http://localhost:' + configService.get<string>(PORT),
  );
}
bootstrap();
