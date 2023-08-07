import { BE_PORT } from '@common/app.constants';
import { CorsOptions } from '@configs/config.cors';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);
  // app.enableCors(CorsOptions);
  // await app.listen(configService.get<string>(BE_PORT));
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'user-consumer',
        },
      },
    },
  );
  const configService = app.get(ConfigService);
  app.listen();
  Logger.log(
    'UserService is running at: http://localhost:' +
      configService.get<string>(BE_PORT),
  );
}
bootstrap();
