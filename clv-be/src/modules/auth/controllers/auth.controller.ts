import { AuthResponseDTO, LoginDTO, RegisterDTO } from '@auth/dto';
import { GoogleOauthGuard } from '@auth/guards/google.guard';
import { AuthService } from '@auth/services/auth.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleOauthGuard)
  @Get('google')
  async googleAuth() {}

  @UseGuards(GoogleOauthGuard)
  @Get('google-redirect')
  googleAuthRedirect(@Req() req: Request) {
    return this.authService.googleLogin(req);
  }

  @Post('register')
  register(@Body() body: RegisterDTO): Promise<AuthResponseDTO> {
    return this.authService.registerUser(body);
  }

  @Post('login')
  login(@Body() body: LoginDTO): Promise<AuthResponseDTO> {
    return this.authService.loginUser(body);
  }

  // @Post('/logout')
  // async getUserLogout(@Req() response:): Promise<Response> {
  //   response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
  //   response.clearCookie('access_token');
  //   response.clearCookie('token');

  //   return response.sendStatus(200);
  // }
}
