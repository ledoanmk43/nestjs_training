import { IsNotEmpty, IsUppercase } from 'class-validator';

export class PermissionDto {
  @IsNotEmpty()
  rolesName: string[];

  @IsNotEmpty()
  @IsUppercase()
  name: string;

  @IsNotEmpty()
  description: string;

  rolesIds: string[];
}
