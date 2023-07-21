import { AuthenticationGuard, AuthorizationGuard } from '@auth/guards';
import { GET_ALL_PERMISSIONS } from '@common/app.user-permission';
import { AuthReq } from '@common/common.types';
import {
  ACTIVAVTE_USER,
  ADD_PERMISSION,
  GET_ALL_USER,
} from '@common/migration.permission';
import { HasPermission } from '@decorators/index';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ActivateDto, PermissionDto } from '@user/dto';
import { Permission, User } from '@user/models';
import { PermissionService, RoleService, UserService } from '@user/services';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Get('profile')
  getUserById(@Req() request: AuthReq): Promise<User> {
    // can also create a Decorator to get user instead of creating a new "AuthReq" type
    return this.userService.searchUserById(request.user.id);
  }

  @HttpCode(202)
  @HasPermission(ACTIVAVTE_USER)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Post('activate')
  activateUserById(@Body() activateDto: ActivateDto): Promise<void> {
    return this.userService.updateUserStatusById(activateDto);
  }

  @HasPermission(GET_ALL_USER)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Get('list')
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @HasPermission(ADD_PERMISSION)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Post('new-permission')
  async createPermission(@Body() permissionDto: PermissionDto): Promise<void> {
    // Check if role does exist
    const role = await this.roleService.searchRoleByCondition({
      where: { id: permissionDto.roleId },
      relations: ['permissions'],
    });
    // Then create new permission
    const permission = await this.permissionService.addPermission(
      permissionDto,
    );
    // Update relationship between Role and Permission
    if (role) {
      role.permissions.push(permission);
      await this.roleService.addRole(role);
    }
  }

  @HasPermission(GET_ALL_PERMISSIONS)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Get('list-permission')
  getListPermission(): Promise<Permission[]> {
    return this.permissionService.getAllPermission();
  }
}
