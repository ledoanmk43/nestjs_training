import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';

import { Role } from '@user/models';
import { RoleRepository } from '@user/repositories';

@Injectable()
export class RoleService {
  constructor(
    @Inject(forwardRef(() => RoleRepository))
    private readonly roleRepository: RoleRepository,
  ) {}

  async searchRoleByCondition(condition: any): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne(condition);
      if (role) {
        return role;
      } else {
        throw new Error('role not found');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async addRole(roleDto: Role): Promise<Role> {
    try {
      const role = await this.roleRepository.save(roleDto);
      if (role) {
        return role;
      } else {
        throw new Error('Fail to save');
      }
    } catch (error) {
      Logger.error(error.message);
      if (error.message.includes('duplicate key')) {
        throw new HttpException('Role is already taken', HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async addListRoles(rolesDto: Role[]): Promise<Role[]> {
    try {
      const roles = await this.roleRepository.save(rolesDto);
      if (roles) {
        return roles;
      } else {
        throw new Error('Fail to save');
      }
    } catch (error) {
      Logger.error(error.message);
      if (error.message.includes('duplicate key')) {
        throw new HttpException('Role is already taken', HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async searchListRoleByCondition(condition: any): Promise<Role[]> {
    try {
      const roles = await this.roleRepository.findWithRelations(condition);
      if (roles) {
        return roles;
      } else {
        throw new Error('no role found');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
