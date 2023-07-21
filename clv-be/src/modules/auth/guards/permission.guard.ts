import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { In } from 'typeorm';
import { RoleService } from '@user/services';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const fromRequestPermission = this.reflector.get<string[]>(
      'PERMISSION',
      context.getHandler(),
    );
    if (!fromRequestPermission) {
      return false;
    }
    try {
      const request = context.switchToHttp().getRequest();
      const listPermissionName: string[] =
        await this.searchPermissionListByRoleId(request.user.role_id);
      return this.hasPermission(listPermissionName, fromRequestPermission);
    } catch (error) {
      Logger.error(error.message);
      throw new UnauthorizedException(error.message);
    }
  }

  // Check target permission and user permission if match
  hasPermission(fromDb: string[], fromRequest: string[]): boolean {
    const hasPermission = fromRequest.every((permission) =>
      fromDb.includes(permission),
    );
    if (hasPermission) {
      return true;
    }
    throw new Error('Forbidden');
  }

  async searchPermissionListByRoleId(id: string[]) {
    const roles = await this.roleService.searchRoleByCondition({
      where: {
        id: In(id),
      },
      relations: ['permissions'],
    });
    return roles.permissions.map((permission) => {
      return permission.name;
    });
  }
}
