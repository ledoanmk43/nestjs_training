import {
  AuthResponseDTO,
  LoginDTO,
  RedisTokenDTO,
  RegisterDTO,
} from '@auth/dto';
import { ValidRedisDTO } from '@auth/dto/auth.response.dto';
import { AuthenticationGuard } from '@auth/guards';
import { GoogleOauthGuard } from '@auth/guards/google.guard';
import { AuthService } from '@auth/services/auth.service';
import { AuthReq, OAuthReq } from '@common/common.types';
import {
  API_GATEWAY,
  GET_MAILING_ON_SIGNUP_RESPONSE_TOPIC,
  GOOGLE_REDIRECT_URL,
  NOTI_SERVICE,
} from '@kafka/constant';
import {
  Body,
  Controller,
  Get,
  Inject,
  OnApplicationShutdown,
  OnModuleInit,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { Request } from 'express';

@Controller('auth')
export class AuthController implements OnModuleInit, OnApplicationShutdown {
  constructor(
    @Inject(NOTI_SERVICE) private readonly mailingClient: ClientKafka,
    @Inject(API_GATEWAY) private readonly gatewayClient: ClientKafka,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(GoogleOauthGuard)
  @Get('google')
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: OAuthReq, @Res() res: any) {
    const data = await this.authService.googleLogin(req.user);
    if (data) {
      res.redirect(
        this.configService.get(GOOGLE_REDIRECT_URL) + data.accessToken,
      );
    } else {
      res.redirect('http://localhost:3000/login');
    }
  }

  @Post('validate-redis-session')
  async checkIsValidSessionToken(
    @Body() body: RedisTokenDTO,
  ): Promise<ValidRedisDTO> {
    const isValid = await this.authService.checkIsValidSessionToken(
      body.idToken,
    );
    const res = new ValidRedisDTO();
    res.isValid = isValid;
    return res;
  }

  @Post('register')
  register(@Body() body: RegisterDTO): Promise<AuthResponseDTO> {
    return this.authService.registerUser(body);
  }
  
  @Post('login')
  @EventPattern('GET_M_USER_RESPONSE_TOPIC')
  login(
    @Body() body: LoginDTO,
    @Req() request: Request,
  ): Promise<AuthResponseDTO> {
    console.log(request);
    return this.authService.loginUser(body);
  }

  @UseGuards(AuthenticationGuard)
  @Post('logout')
  async getUserLogout(@Req() request: AuthReq) {
    await this.authService.addAccessTokenBlackList(
      request.user.accessToken,
      request.user.id,
    );
  }

  async onModuleInit() {
    const requestPatterns: string[] = [GET_MAILING_ON_SIGNUP_RESPONSE_TOPIC];

    requestPatterns.forEach((topic: string) => {
      this.mailingClient.subscribeToResponseOf(topic);
    });

    await this.mailingClient.connect();
  }

  async onApplicationShutdown() {
    await this.mailingClient.close();
  }
}
