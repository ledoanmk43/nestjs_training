import { BE_PORT as USER_PORT } from '@common/app.constants';
import { CorsOptions } from '@configs/config.cors';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

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
        groupId: process.env.KAFKA_USER_CONSUMER_GROUP_ID,
      },
    },
  });

  await app.startAllMicroservices().then(() => {
    Logger.log('[Consumer] Kafka of User Service is running!');
  });
  await app.listen(configService.get<string>(USER_PORT));
  Logger.log(
    '[User Service] is running at: http://localhost:' +
      configService.get<string>(USER_PORT),
  );
}
bootstrap();
