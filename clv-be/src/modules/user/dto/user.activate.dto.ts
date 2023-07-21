import { IsEmail, IsNotEmpty } from 'class-validator';

export class ActivateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
