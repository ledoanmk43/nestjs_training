import {
  REDIS_NEW_PW_MAIL_EXPIRE_TIME,
  REDIS_RESET_PW_MAIL_EXPIRE_TIME,
} from '@common/app.constants';
import { REDIS_CHANGE_PW_SESSION, REDIS_RESET_PW_SESSION } from '@common/app.redis.action';
import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@user/models';
import { UserService } from '@user/services';
import { generateRandomPassword, getRandomToken } from '@utils/index';
import { Cache } from 'cache-manager';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailingService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}
  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.configService.get('CLIENT_ID'),
      this.configService.get('CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: this.configService.get<string>('REFRESH_TOKEN'),
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get<string>('EMAIL_ACCOUNT'),
        clientId: this.configService.get<string>('CLIENT_ID'),
        clientSecret: this.configService.get<string>('CLIENT_SECRET'),
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  async sendResetPwMail(userEmail: string): Promise<void> {
    await this.setTransport();
    try {
      const newPassword: string = generateRandomPassword();
      const updatedUser: User = await this.userService.updateUserPwByEmail(
        userEmail,
        newPassword,
      );
      if (updatedUser) {
        const idToken = getRandomToken();
        await this.cacheManager.set(
          idToken,
          REDIS_RESET_PW_SESSION,
          this.configService.get<number>(REDIS_RESET_PW_MAIL_EXPIRE_TIME),
        ); // expire in 15 minutes
        await this.mailerService.sendMail({
          transporterName: 'gmail',
          to: updatedUser.email,
          from: this.configService.get('EMAIL_ACCOUNT'),
          subject: '[Reset Password] Reset your CLV training password',
          template: 'action',
          context: {
            expireTime: '15 minutes',
            name: updatedUser.firstName,
            password: newPassword,
            link:
              this.configService.get<string>('AUTH_RESET_PASSWORD_URL') +
              updatedUser.email +
              '&idToken=' +
              idToken,
          },
        });
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async sendNewPwOnSignUpMail(
    newUser: User,
    defaultPassword: string,
  ): Promise<void> {
    await this.setTransport();
    try {
      const idToken = getRandomToken();
      await this.cacheManager.set(
        idToken,
        REDIS_CHANGE_PW_SESSION,
        this.configService.get<number>(REDIS_NEW_PW_MAIL_EXPIRE_TIME),
      ); //expires in 1 day
      await this.mailerService.sendMail({
        transporterName: 'gmail',
        to: newUser.email,
        from: this.configService.get<string>('EMAIL_ACCOUNT'),
        subject: '[Welcome] CLV training password for new member',
        template: 'action',
        context: {
          expireTime: '1 day',
          name: newUser.firstName,
          password: defaultPassword,
          link:
            this.configService.get<string>('AUTH_RESET_PASSWORD_URL') +
            newUser.email +
            '&idToken=' +
            idToken,
        },
      });
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
