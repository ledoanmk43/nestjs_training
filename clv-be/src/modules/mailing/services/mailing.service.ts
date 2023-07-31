import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@user/models';
import { UserService } from '@user/services';
import { generateRandomPassword } from '@utils/index';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailingService {
  constructor(
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
      refresh_token: this.configService.get('REFRESH_TOKEN'),
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
        user: this.configService.get('EMAIL_ACCOUNT'),
        clientId: this.configService.get('CLIENT_ID'),
        clientSecret: this.configService.get('CLIENT_SECRET'),
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
        await this.mailerService.sendMail({
          transporterName: 'gmail',
          to: updatedUser.email,
          from: this.configService.get('EMAIL_ACCOUNT'),
          subject: '[Reset Password] Reset your CLV training password',
          template: 'action',
          context: {
            name: updatedUser.firstName,
            password: newPassword,
            link: `http://localhost:3000/profile/reset-password?e=${updatedUser.email}  `,
          },
        });
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
