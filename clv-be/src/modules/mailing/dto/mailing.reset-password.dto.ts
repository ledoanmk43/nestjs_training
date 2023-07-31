import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class ResetPwDTO {
  @Expose()
  @IsNotEmpty()
  email: string;
}
