import { AuthResponseDTO, RegisterDTO } from '@auth/dto';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { ActivateDto, ResetPwDto } from '@user/dto';
import { User } from '@user/models';
import { UserRepository } from '@user/repositories';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
  ) {}

  async addUser(userDto: RegisterDTO): Promise<User> {
    try {
      const newUser = this.userRepository.create(userDto);
      const user = await this.userRepository.save(newUser);
      return user;
    } catch (error) {
      Logger.error(error.message);
      if (error.message.includes('duplicate key')) {
        throw new HttpException('Email is already taken', HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async searchUserByCondition(condition: any): Promise<User> {
    try {
      const user = await this.userRepository.findOne(condition);
      return user;
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async searchUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneById(id);
      return user;
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async updateUserStatusByEmail(activateDto: ActivateDto): Promise<void> {
    try {
      const user = await this.searchUserByCondition({
        where: { email: activateDto.email },
      });
      if (user) {
        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({
            isDisable: !user.isDisable,
            isPending: !user.isPending,
          })
          .where('id = :id', { id: user.id })
          .execute();
      } else {
        throw new Error('user not found');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUserPwByEmail(
    userEmail: string,
    temporaryPw: string,
  ): Promise<User> {
    try {
      const user = await this.searchUserByCondition({
        where: { email: userEmail },
      });
      if (user) {
        temporaryPw = bcrypt.hashSync(temporaryPw, bcrypt.genSaltSync());
        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({
            password: temporaryPw,
          })
          .where('id = :id', { id: user.id })
          .execute();
        return user;
      } else {
        throw new Error('This email does not exist');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async resetPw(resetPwDto: ResetPwDto): Promise<void> {
    try {
      const user = await this.searchUserByCondition({
        where: { email: resetPwDto.email },
      });
      // Verify password
      if (user) {
        //check current password from dto and user in db
        const isVerified = await bcrypt.compare(
          resetPwDto.currentPassword,
          user.password,
        );
        if (isVerified) {
          // hash password from dto
          const newPw = bcrypt.hashSync(
            resetPwDto.newPassword,
            bcrypt.genSaltSync(),
          );
          // and then save new password
          await this.userRepository
            .createQueryBuilder()
            .update(User)
            .set({
              password: newPw,
            })
            .where('id = :id', { id: user.id })
            .execute();
        } else {
          throw new Error('wrong current password');
        }
      } else {
        throw new Error('user not found');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const listUser = await this.userRepository.find({
        order: {
          createdAt: 'ASC',
        },
      });
      if (listUser) {
        return listUser;
      } else {
        throw new Error('user not found');
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
