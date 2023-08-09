import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
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
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
