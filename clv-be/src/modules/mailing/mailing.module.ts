import { MailingController } from '@mailing/controllers/mailing.controller';
import { MailingService } from '@mailing/services/mailing.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '@user/user.module';
@Module({
  imports: [UserModule],
  controllers: [MailingController],
  providers: [MailingService, ConfigService],
  exports: [MailingService],
})
export class MailingModule {}
