import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailingService } from '@mailing/services/mailing.service';
import { MailingController } from '@mailing/controllers/mailing.controller';
@Module({
  providers: [MailingService, ConfigService],
  controllers: [MailingController],
})
export class MailingModule {}
