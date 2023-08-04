import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class LogOutDTO {
  @IsNotEmpty()
  accessToken: string;
}
