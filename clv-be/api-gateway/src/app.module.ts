import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiGatewayModule } from './api-gateway/api.gateway.module';

@Module({
  imports: [ApiGatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
