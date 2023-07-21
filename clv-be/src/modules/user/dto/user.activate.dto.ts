import { IsNotEmpty, IsUUID } from 'class-validator';

export class ActivateDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
