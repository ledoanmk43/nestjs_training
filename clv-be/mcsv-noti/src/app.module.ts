import { MailingModule } from '@mailing/mailing.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailingController } from './modules/mailing/controllers/mailing.controller';
import { MailingService } from './modules/mailing/services/mailing.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MailingModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController, MailingController],
  providers: [AppService, MailingService],
})
export class AppModule {}
