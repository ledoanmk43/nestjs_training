import { MailingController } from '@mailing/controllers/mailing.controller';
import { MailingService } from '@mailing/services/mailing.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [MailingController],
  providers: [MailingService],
})
export class MailingModule {}
