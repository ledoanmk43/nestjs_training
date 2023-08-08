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
import { GET_MAILING_ON_SIGNUP_RESPONSE_TOPIC } from '@kafka/constant';
import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(
    @Inject('NOTI_SERVICE') private readonly mailingClient: ClientKafka,
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
        this.configService.get('GOOGLE_REDIRECT_URL') + data.accessToken,
      );
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
  login(@Body() body: LoginDTO): Promise<AuthResponseDTO> {
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

  onModuleInit() {
    const requestPatterns: string[] = [GET_MAILING_ON_SIGNUP_RESPONSE_TOPIC];

    requestPatterns.forEach((topic: string) => {
      this.mailingClient.subscribeToResponseOf(topic);
    });
  }
}
