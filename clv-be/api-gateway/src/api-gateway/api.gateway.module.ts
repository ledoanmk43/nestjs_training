import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api.controller.gateway';
import { ApiGatewayService } from './api.service.gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
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
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
