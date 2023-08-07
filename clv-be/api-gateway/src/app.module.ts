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
            clientId: 'user',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'user-consumer',
          },
        },
      },
      {
        name: 'NOTI_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'noti',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'noti-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
