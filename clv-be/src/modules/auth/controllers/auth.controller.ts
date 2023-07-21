import { AuthResponseDTO, LoginDTO, RegisterDTO } from '@auth/dto';
import { AuthService } from '@auth/services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
