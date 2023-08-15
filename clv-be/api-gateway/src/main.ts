import { CorsOptions } from '@configs/config.cors';
import { RegisterMicroservices } from '@configs/config.mcvs';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CorsOptions);
  RegisterMicroservices(app);
  await app.startAllMicroservices().then(() => {
    Logger.log('[Consumer] Kafka of Gateway is running!');
  });
  await app.listen(process.env.GATEWAY_PORT);
  Logger.log(
    'API GATEWAY is running at: http://localhost:' + process.env.GATEWAY_PORT,
  );
}
bootstrap();
