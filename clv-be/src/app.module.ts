import { AuthModule } from '@auth/auth.module';
import config from '@configs/config.default';
import { providers } from '@configs/config.provider';
import { TypeOrmConfigService } from '@configs/config.typeorm';
import { MailingController } from '@mailing/controllers/mailing.controller';
import { MailingModule } from '@mailing/mailing.module';
import { MailingService } from '@mailing/services/mailing.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MailingModule,
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
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UserModule,
    MailingModule,
  ],
  controllers: [AppController, MailingController],
  providers: [AppService, ...providers, MailingService],
})
export class AppModule {}
