import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
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
          Logger.error(err);
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

  async sendResetPwMail(data: any): Promise<void> {
    await this.setTransport();
    try {
      await this.mailerService.sendMail({
        transporterName: 'gmail',
        to: data.email,
        from: this.configService.get('EMAIL_ACCOUNT'),
        subject: '[Reset Password] Reset your CLV training password',
        template: 'action',
        context: {
          expireTime: '15 minutes',
          name: data.firstName,
          password: data.tempPassword,
          link: data.redirectUrl + data.email + '&idToken=' + data.idToken,
        },
      });
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async sendNewPwOnSignUpMail(data: any): Promise<void> {
    await this.setTransport();
    try {
      await this.mailerService.sendMail({
        transporterName: 'gmail',
        to: data.email,
        from: this.configService.get('EMAIL_ACCOUNT'),
        subject: '[Welcome] CLV training password for new member',
        template: 'action',
        context: {
          expireTime: '1 day',
          name: data.firstName,
          password: data.tempPassword,
          link: data.redirectUrl + data.email + '&idToken=' + data.idToken,
        },
      });
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
