import { Expose } from 'class-transformer';

export class AuthResponseDTO {
  @Expose()
  accessToken: string;
}

export class SendEmailResetPwResponseDTO {
  @Expose()
  message: string;
}
