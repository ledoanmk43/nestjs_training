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
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
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
}
