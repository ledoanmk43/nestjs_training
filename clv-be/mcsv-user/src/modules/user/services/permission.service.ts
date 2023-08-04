import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { EditPermissionDto, PermissionDto } from '@user/dto';
import { Permission, Role } from '@user/models';
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
      const listPermission = await this.permissionRepository.find({
        relations: ['roles'],
        order: {
          createdAt: 'ASC',
        },
      });
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

  async editPermission(
    editPermissionDto: EditPermissionDto,
    targetListRoles: Role[],
  ): Promise<void> {
    try {
      const permissionToUpdate: Permission =
        await this.permissionRepository.findOne({
          where: {
            name: editPermissionDto.permissionName,
          },
          relations: ['roles'],
        });

      if (!permissionToUpdate) {
        throw new Error('Permission not found');
      } else {
        permissionToUpdate.roles = targetListRoles;
        await this.permissionRepository.save(permissionToUpdate);
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
