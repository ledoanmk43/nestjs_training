import { MailingController } from '@mailing/controllers/mailing.controller';
import { MailingService } from '@mailing/services/mailing.service';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [],
  controllers: [MailingController],
  providers: [MailingService],
})
export class MailingModule {}
