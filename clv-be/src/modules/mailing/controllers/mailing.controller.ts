import { SendEmailResetPwResponseDTO } from '@auth/dto/auth.response.dto';
import { MailingService } from '@mailing/services/mailing.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ResetPwDTO } from '@mailing/dto/mailing.reset-password.dto';

@Controller('mailing')
export class MailingController {
  constructor(readonly mailingService: MailingService) {}

  @Post('new-password-mail')
  async sendResetPwMail(
    @Body() resetPwDTO: ResetPwDTO,
  ): Promise<SendEmailResetPwResponseDTO> {
    await this.mailingService.sendResetPwMail(resetPwDTO.email);
    const res: SendEmailResetPwResponseDTO = new SendEmailResetPwResponseDTO();
    res.message = 'We just sent you an email to reset your password';
    return res;
  }

  @Get('reset-mail')
  async sendResetPasswordMail() {
    // await this.mailingService.sendResetPasswordMail();
  }
}
