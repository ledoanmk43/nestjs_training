import { Transport } from '@nestjs/microservices';

export const KafkaClients = [
  {
    name: 'NOTI_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_NOTI_CLIENT_ID,
        brokers: [process.env.KAFKA_BROKER_ID],
      },
      consumer: {
        groupId: process.env.KAFKA_NOTI_CONSUMER_GROUP_ID,
      },
    },
  },
  {
    name: 'USER_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_USER_CLIENT_ID,
        brokers: [process.env.KAFKA_BROKER_ID],
      },
      consumer: {
        groupId: process.env.KAFKA_USER_CONSUMER_GROUP_ID,
      },
    },
  },
];
