import { AuthModule } from '@auth/auth.module';
import config from '@configs/config.default';
import { TypeOrmConfigService } from '@configs/config.typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { providers } from './configs/config.provider';
import { MailingController } from './modules/mailing/controllers/mailing.controller';
import { MailingModule } from './modules/mailing/mailing.module';
import { MailingService } from './modules/mailing/services/mailing.service';

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
