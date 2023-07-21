import { IsNotEmpty, IsUUID, IsUppercase } from 'class-validator';

export class PermissionDto {
  @IsNotEmpty()
  @IsUUID()
  roleId: string;

  @IsNotEmpty()
  @IsUppercase()
  name: string;

  @IsNotEmpty()
  description: string;
}
