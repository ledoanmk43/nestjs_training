import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { RegisterDTO } from '@auth/dto';
import { ActivateDto } from '@user/dto';
import { User } from '@user/models';
import { UserRepository } from '@user/repositories';

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
      if (user) {
        return user;
      } else {
        throw new Error('user not found');
      }
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

  async updateUserStatusById(activateDto: ActivateDto): Promise<void> {
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
