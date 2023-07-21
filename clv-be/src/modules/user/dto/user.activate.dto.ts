import { IsEmail, IsNotEmpty } from 'class-validator';

export class ActivateDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
