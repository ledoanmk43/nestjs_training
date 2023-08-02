import { MailingController } from '@mailing/controllers/mailing.controller';
import { MailingService } from '@mailing/services/mailing.service';
import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
@Module({
  imports: [UserModule],
  controllers: [MailingController],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
