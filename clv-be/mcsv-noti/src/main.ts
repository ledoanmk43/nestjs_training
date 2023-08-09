import { NOTI_PORT } from '@common/app.constants';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { CorsOptions } from './configs/config.cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors(CorsOptions);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER_ID],
      },
      consumer: {
        groupId: process.env.KAFKA_NOTI_CONSUMER_GROUP_ID,
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
