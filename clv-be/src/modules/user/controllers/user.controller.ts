import { AuthenticationGuard, AuthorizationGuard } from '@auth/guards';
import {
  GET_ALL_PERMISSIONS,
  UPDATE_PERMISSION_ROLE,
} from '@common/app.user-permission';
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
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ActivateDto, PermissionDto } from '@user/dto';
import { Permission, User } from '@user/models';
import { PermissionService, RoleService, UserService } from '@user/services';
import { In } from 'typeorm';
import { EditPermissionDto } from '@user/dto/permission.edit.dto';

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
  @Put('activate')
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

  @HasPermission(UPDATE_PERMISSION_ROLE)
  @UseGuards(AuthorizationGuard)
  @UseGuards(AuthenticationGuard)
  @Put('edit-permission-role')
  async changePermissionRole(
    @Body() editPermissionDto: EditPermissionDto,
  ): Promise<void> {
    // Check if role does exist
    if (editPermissionDto.rolesName.length < 1) {
      throw new HttpException(
        'Roles must not be empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    const targetListRoles = await this.roleService.searchListRoleByCondition({
      where: { name: In(editPermissionDto.rolesName) },
    });
    // Then create new permission
    if (targetListRoles.length > 0) {
      return await this.permissionService.editPermission(
        editPermissionDto,
        targetListRoles,
      );
    } else {
      throw new HttpException('no role found', HttpStatus.BAD_REQUEST);
    }
  }
}
