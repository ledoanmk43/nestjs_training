import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { PermissionDto } from '@user/dto';
import { Permission } from '@user/models';
import { PermissionRepository } from '@user/repositories';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(forwardRef(() => PermissionRepository))
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async addPermission(permissionDto: PermissionDto): Promise<Permission> {
    try {
      const newPermissionIns = this.permissionRepository.create(permissionDto);
      const permission = await this.permissionRepository.save(newPermissionIns);
      return permission;
    } catch (error) {
      Logger.error(error.message);
      if (error.message.includes('duplicate key')) {
        throw new HttpException(
          'This permission alrealy exists',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getAllPermission(): Promise<Permission[]> {
    try {
      const listPermission = await this.permissionRepository.findAll();
      if (listPermission) {
        return listPermission;
      } else {
        throw new Error('No permission found');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
