import { APP_DOMAIN, GATEWAY_REDIRECT } from '@common/app.constants';
import { CorsOptions } from '@configs/config.cors';
import { HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { WebSocketGateway } from '@nestjs/websockets';
import { ServiceMapping as PortServiceMapping } from '@utils/index';
import { Request } from 'express';
import { GET_M_USER_RESPONSE_TOPIC, USER_SERVICE } from '@kafka/kafka.constant';

@WebSocketGateway({
  cors: CorsOptions,
})
export class ApiGatewayService {
  constructor(
    @Inject(USER_SERVICE) private readonly M_User_ClientKafka: ClientKafka,
  ) {}
  private logger: Logger = new Logger('CLV API Gateway');

  async redirectRequest(request: Request): Promise<any> {
    const PORT: string = PortServiceMapping(request.url);
    // Ignore serviceName and path from request
    const { serviceName, path, ...params } = request.params;
    try {
      request.url = APP_DOMAIN + PORT + request.url;
      request.params = params;
      const response = await new Promise<boolean>((resolve) => {
        Logger.log(`[REDIRECT TO] ${request.url}`);
        this.M_User_ClientKafka.emit(
          GET_M_USER_RESPONSE_TOPIC,
          request,
        ).subscribe((data) => {
          if (data) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
      return response;
      // this.wsServer.emit(GATEWAY_REDIRECT + PORT, request);
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
