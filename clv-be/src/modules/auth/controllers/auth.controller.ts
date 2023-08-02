import {
  AuthResponseDTO,
  LoginDTO,
  RedisTokenDTO,
  RegisterDTO,
} from '@auth/dto';

import { ValidRedisDTO } from '@auth/dto/auth.response.dto';
import { GoogleOauthGuard } from '@auth/guards/google.guard';
import { AuthService } from '@auth/services/auth.service';
import { OAuthReq } from '@common/common.types';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { config } from 'dotenv';

config();
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleOauthGuard)
  @Get('google')
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: OAuthReq, @Res() res: any) {
    const data = await this.authService.googleLogin(req.user);
    if (data) {
      res.redirect(process.env.GOOGLE_REDIRECT_URL + data.accessToken);
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

  @Post('logout')
  async getUserLogout(@Req() req: any): Promise<Response> {
    return req.sendStatus(200);
  }
}
