import { Transport } from '@nestjs/microservices';

export const KafkaClients = [
  {
    name: 'API_GATEWAY',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_GATEWAY_CLIENT_ID,
        brokers: [process.env.KAFKA_BROKER_ID],
      },
      consumer: {
        groupId: process.env.KAFKA_GATEWAY_CONSUMER_GROUP_ID,
      },
    },
  },
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
];
