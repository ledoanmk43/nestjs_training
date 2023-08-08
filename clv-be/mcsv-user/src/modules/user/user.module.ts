import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    ClientsModule.register([
      {
        name: 'NOTI_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'notification',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'noti-consumer',
          },
        },
      },
    ]),
  ],
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
