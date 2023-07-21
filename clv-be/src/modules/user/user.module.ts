import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@user/controllers/user.controller';
import { Permission, Role, User } from '@user/models';
import {
  PermissionRepository,
  RoleRepository,
  UserRepository,
} from '@user/repositories';
import { PermissionService, RoleService, UserService } from '@user/services';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    RoleService,
    RoleRepository,
    PermissionService,
    PermissionRepository,
  ],
  exports: [UserService, RoleService, UserRepository, RoleRepository],
})
export class UserModule {}
