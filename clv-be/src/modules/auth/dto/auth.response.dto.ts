import { Expose } from 'class-transformer';

export class AuthResponseDTO {
  @Expose()
  accessToken: string;
}
