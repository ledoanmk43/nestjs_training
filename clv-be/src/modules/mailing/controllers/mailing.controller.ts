import { Controller, Get } from '@nestjs/common';
import { MailingService } from '@mailing/services/mailing.service';

@Controller('mailing')
export class MailingController {
  constructor(readonly mailingService: MailingService) {}
  @Get('send-mail')
  public sendMail() {
    this.mailingService.sendMail();
  }
}
