import { MailingService } from '@mailing/services/mailing.service';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('mailing')
export class MailingController {
  constructor(
    private readonly mailingService: MailingService,
  ) {}

  @MessagePattern('GET_MAILING_RESET_PW_RESPONSE_TOPIC')
  async sendResetPwMail(data: any): Promise<void> {
    await this.mailingService.sendResetPwMail(data);
  }

  @MessagePattern('GET_MAILING_ON_SIGNUP_RESPONSE_TOPIC')
  async sendNewPwOnSignUpMail(data: any): Promise<void> {
    await this.mailingService.sendNewPwOnSignUpMail(data);
  }

}
