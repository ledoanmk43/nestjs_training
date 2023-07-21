import { IsNotEmpty, IsUppercase } from 'class-validator';

export class EditPermissionDto {
  @IsNotEmpty()
  rolesName: string[];

  @IsNotEmpty()
  @IsUppercase()
  permissionName: string;
}
