import { NOTI_PORT } from '@common/app.constants';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CorsOptions } from './configs/config.cors';

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
        groupId: 'noti-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get<string>(NOTI_PORT));
  Logger.log(
    '[Notification Service] is running at: http://localhost:' +
      configService.get<string>(NOTI_PORT),
  );
}
bootstrap();
