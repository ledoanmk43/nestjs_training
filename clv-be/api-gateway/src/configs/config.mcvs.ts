import { INestApplication } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export function RegisterMicroservices(app: INestApplication<any>) {
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
  //
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
}
