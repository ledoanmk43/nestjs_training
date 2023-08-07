import { AuthResponseDTO, LoginDTO, RegisterDTO } from '@auth/dto';
import { JwtPayload } from '@auth/jwt/jwt.payload';
import { OAuthUser } from '@common/common.types';
import { MailingService } from '@mailing/services/mailing.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@user/models';
import { RoleService, UserService } from '@user/services';
import { generateRandomPassword } from '@utils/index';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly mailingService: MailingService,
  ) {}

  async googleLogin(userDto: OAuthUser): Promise<AuthResponseDTO> {
    const defaultPassword: string = generateRandomPassword();
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
        // Send mail notification user about new password
        await this.mailingService.sendNewPwOnSignUpMail(user, defaultPassword); //
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
        // Return JWT when succeed
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
      roleIds: roleIdList,
    } as JwtPayload);
    return response;
  }

  async checkIsValidSessionToken(idToken: string): Promise<boolean> {
    const redisData = await this.cacheManager.get(idToken);
    if (redisData) {
      return true;
    } else {
      return false;
    }
  }

  async addAccessTokenBlackList(accessToken: string, userId: string) {
    try {
      const payloadFromToken: any = this.jwtService.verify(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      const ttl: number = (payloadFromToken.exp - currentTime) * 1000; // the remaining time of the token is also the time it will be in blacklist
      if (ttl > 0) {
        await this.cacheManager.set(accessToken, userId, ttl);
      } else {
        throw new HttpException('Token has expired', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
