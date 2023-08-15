import {
  All,
  Controller,
  Inject,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiGatewayService } from './api.service.gateway';
import { USER_SERVICE, GET_M_USER_RESPONSE_TOPIC } from '@kafka/kafka.constant';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class ApiGatewayController
  implements OnModuleInit, OnApplicationShutdown
{
  constructor(
    @Inject(USER_SERVICE) private readonly M_UserClient: ClientKafka,
    private readonly gwService: ApiGatewayService,
  ) {}
  @All('/:serviceName/:path')
  onIncomingRequest(@Req() request: Request): Promise<any> {
    return this.gwService.redirectRequest(request);
  }

  async onModuleInit() {
    const requestPatterns: string[] = [GET_M_USER_RESPONSE_TOPIC];

    requestPatterns.forEach((topic: string) => {
      this.M_UserClient.subscribeToResponseOf(topic);
    });

    await this.M_UserClient.connect();
  }

  async onApplicationShutdown() {
    await this.M_UserClient.close();
  }
}
