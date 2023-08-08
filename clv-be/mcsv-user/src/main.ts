import { BE_PORT } from '@common/app.constants';
import { CorsOptions } from '@configs/config.cors';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors(CorsOptions);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:29092'],
      },
      consumer: {
        groupId: 'user-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get<string>(BE_PORT));
  Logger.log(
    '[User Service] is running at: http://localhost:' +
      configService.get<string>(BE_PORT),
  );
}
bootstrap();
