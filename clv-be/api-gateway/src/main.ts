import { CorsOptions } from '@configs/config.cors';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);
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
  await app.listen(process.env.GATEWAY_PORT);
  Logger.log(
    'API GATEWAY is running at: http://localhost:' + process.env.GATEWAY_PORT,
  );
}
bootstrap();
