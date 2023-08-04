import { Expose } from 'class-transformer';

export class AuthResponseDTO {
  @Expose()
  accessToken: string;

  idToken?: string;
}

export class SendEmailResetPwResponseDTO {
  @Expose()
  message: string;
}

export class ValidRedisDTO {
  @Expose()
  isValid: boolean;
}
