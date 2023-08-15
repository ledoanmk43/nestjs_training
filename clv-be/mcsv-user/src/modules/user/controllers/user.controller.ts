import { SendEmailResetPwResponseDTO } from '@auth/dto/auth.response.dto';
import { AuthenticationGuard, AuthorizationGuard } from '@auth/guards';
import { REDIS_RESET_PW_SESSION } from '@common/app.redis.action';
import {
  GET_ALL_PERMISSIONS,
  RESET_PASSWORD,
  UPDATE_PERMISSION_ROLE,
} from '@common/app.user-permission';
import { AuthReq } from '@common/common.types';
import {
  ACTIVAVTE_USER,
  ADD_PERMISSION,
  GET_ALL_USER,
} from '@common/migration.permission';
import { HasPermission } from '@decorators/index';
import { GET_MAILING_RESET_PW_RESPONSE_TOPIC } from '@kafka/constant';
import { SendChangePwMailRequest } from '@kafka/dto/send-mail-request.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { ActivateDto, PermissionDto, ResetPwDTO, ResetPwDto } from '@user/dto';
import { EditPermissionDto } from '@user/dto/permission.edit.dto';
import { Permission, User } from '@user/models';
import { PermissionService, RoleService, UserService } from '@user/services';
import { generateRandomPassword, getRandomToken } from '@utils/index';
import { Cache } from 'cache-manager';
import { In } from 'typeorm';

@Controller('user')
export class UserController implements OnModuleInit, OnApplicationShutdown {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject('NOTI_SERVICE') private readonly mailingClient: ClientKafka,
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
  activateUserByEmail(@Body() activateDto: ActivateDto): Promise<void> {
    return this.userService.updateUserStatusByEmail(activateDto);
  }

  @Post('new-password-mail')
  async sendResetPwMail(
    @Body() resetPwDTO: ResetPwDTO,
  ): Promise<SendEmailResetPwResponseDTO> {
    try {
      const idToken = getRandomToken();
      const newPassword: string = generateRandomPassword();
      const user = await this.userService.updateUserPwByEmail(
        resetPwDTO.email,
        newPassword,
      );

      if (user) {
        const mailingParams = new SendChangePwMailRequest(
          idToken,
          newPassword,
          user.firstName,
          user.email,
          process.env.AUTH_RESET_PASSWORD_URL,
        );

        const mailingResponse: boolean = await new Promise<boolean>(
          (resolve) => {
            this.mailingClient
              .emit(
                GET_MAILING_RESET_PW_RESPONSE_TOPIC,
                JSON.stringify(mailingParams),
              )
              .subscribe((data) => {
                if (data) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              });
          },
        );

        if (mailingResponse) {
          await this.cacheManager.set(
            idToken,
            REDIS_RESET_PW_SESSION,
            Number(process.env.REDIS_RESET_PW_MAIL_EXPIRE_TIME),
          ); // expire in 15 minutes

          const res: SendEmailResetPwResponseDTO =
            new SendEmailResetPwResponseDTO();
          res.message = 'We just sent you an email to reset your password';
          return res;
        }
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @HttpCode(202)
  @HasPermission(RESET_PASSWORD)
  @Put('reset-password')
  resetPassword(@Body() resetPwDto: ResetPwDto): Promise<void> {
    return this.userService.resetPw(resetPwDto);
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
    const roles = await this.roleService.searchListRoleByCondition({
      where: { name: In(permissionDto.rolesName) },
      relations: ['permissions'],
    });
    // Then create new permission
    const permission = await this.permissionService.addPermission(
      permissionDto,
    );
    // Update relationship between Role and Permission
    if (roles && permission) {
      roles.map((role) => role.permissions.push(permission));
      await this.roleService.addListRoles(roles);
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

  async onModuleInit() {
    const requestPatterns: string[] = [GET_MAILING_RESET_PW_RESPONSE_TOPIC];

    requestPatterns.forEach((topic: string) => {
      this.mailingClient.subscribeToResponseOf(topic);
    });

    await this.mailingClient.connect();
  }

  async onApplicationShutdown() {
    await this.mailingClient.close();
  }
}
