import { AuthResponseDTO, LoginDTO, RegisterDTO } from '@auth/dto';
import { OAuthUser } from '@common/common.types';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@src/modules/auth/jwt/jwt.payload';
import { User } from '@user/models';
import { RoleService, UserService } from '@user/services';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
  ) {}

  async googleLogin(userDto: OAuthUser): Promise<AuthResponseDTO> {
    const defaultPassword: string = 'A1231230@a';
    try {
      const user = await this.userService.searchUserByCondition({
        where: { email: userDto.email },
        relations: ['roles'],
      });
      if (user) {
        const roleIdList = user.roles.map((role) => {
          return role.id;
        });
        // Return JWT if success
        return this.generateAccessToken(user, roleIdList);
      } else {
        const newUserDto: RegisterDTO = {
          firstName: userDto.firstName,
          lastName: userDto.lastName,
          email: userDto.email,
          password: defaultPassword,
          role: null,
        };
        // Create new user
        const user = await this.userService.addUser(newUserDto);
        // Get role
        const role = await this.roleService.searchRoleByCondition({
          where: { name: 'USER' },
          relations: ['users'],
        });
        role.users.push(user);
        //Insert to junction table
        const savedRole = await this.roleService.addRole(role);
        // Return JWT if success
        return this.generateAccessToken(user, [savedRole.id]);
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Register new user
  async registerUser(userDto: RegisterDTO): Promise<AuthResponseDTO> {
    try {
      // Create new user
      const user = await this.userService.addUser(userDto);
      // Get role
      const role = await this.roleService.searchRoleByCondition({
        where: { name: 'USER' },
        relations: ['users'],
      });
      role.users.push(user);
      //Insert to junction table
      const savedRole = await this.roleService.addRole(role);
      // Return JWT if success
      return this.generateAccessToken(user, [savedRole.id]);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Authenticate user
  async loginUser(userDto: LoginDTO): Promise<AuthResponseDTO> {
    try {
      // Find user by email
      const user = await this.userService.searchUserByCondition({
        where: { email: userDto.email },
        relations: ['roles'],
      });
      if (!user) {
        throw new Error('Email does not exist');
      }
      // Verify password
      const isVerified = await bcrypt.compare(userDto.password, user.password);
      if (isVerified) {
        const roleIdList = user.roles.map((role) => {
          return role.id;
        });
        // Return JWT if success
        return this.generateAccessToken(user, roleIdList);
      } else {
        throw new BadRequestException('Wrong password');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  generateAccessToken(user: User, roleIdList: string[]): AuthResponseDTO {
    const response: AuthResponseDTO = new AuthResponseDTO();
    response.accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role_id: roleIdList,
    } as JwtPayload);
    return response;
  }
}
