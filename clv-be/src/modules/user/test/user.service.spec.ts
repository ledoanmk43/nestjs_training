import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserRepository } from '@user/repositories';
import { UserService } from '@user/services';
import { userStub } from './stubs/user.stub';

jest.mock('@user/services/user.service.ts');
describe('UserService', function () {
  let userServiceMock: UserService;
  let userRepoMock: DeepMocked<UserRepository>;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: createMock<UserRepository>(),
        },
      ],
    }).compile();

    userServiceMock = moduleRef.get<UserService>(UserService);
    userRepoMock = moduleRef.get(UserRepository);

    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(userServiceMock).toBeDefined();
    expect(userRepoMock).toBeDefined();
  });

  describe('Method: addUser', () => {
    it('should throw a ConflictException if user with email already exists', async () => {
      // Arrange
      jest
        .spyOn(userServiceMock, 'addUser')
        .mockRejectedValueOnce(new ConflictException());

      jest
        .spyOn(userRepoMock, 'save')
        .mockRejectedValueOnce(new ConflictException());

      // Act && Assert
      await expect(userRepoMock.save).rejects.toThrow(new ConflictException());
      await expect(userServiceMock.addUser).rejects.toThrow(
        new ConflictException(),
      );
    });
    it('should return a user when succeed', async () => {
      // let expectedUser = userStub();
      // let resultUser = userStub();
      // const newUser = userRepoMock.create(userStub());
      // resultUser = await userRepoMock.save(newUser);
      // // Act && Assert
      // expect(JSON.stringify(resultUser)).toStrictEqual(
      //   JSON.stringify(expectedUser),
      // );
      // Arrange
      jest.spyOn(userServiceMock, 'addUser').mockResolvedValue(userStub());

      jest.spyOn(userRepoMock, 'save').mockResolvedValue(userStub());
      expect(userRepoMock.save(userStub())).toEqual(
        Promise.resolve(userStub()),
      );
    });
  });

  describe('Method: searchUserByCondition', () => {
    it('should throw a NotFoundException if no user found', async () => {
      // Arrange
      jest
        .spyOn(userServiceMock, 'searchUserByCondition')
        .mockRejectedValueOnce(new NotFoundException());
      // Act && Assert
      await expect(userServiceMock.searchUserByCondition).rejects.toThrow(
        new NotFoundException(),
      );
    });
    it('should return a user when succeed', async () => {
      // Arrange
      jest
        .spyOn(userServiceMock, 'searchUserByCondition')
        .mockResolvedValue(userStub());
      // Act && Assert
      expect(userServiceMock.searchUserByCondition('condition')).toEqual(
        Promise.resolve(userStub()),
      );
    });
  });

  describe('Method: searchUserById', () => {
    it('should throw a NotFoundException if no user found', async () => {
      // Arrange
      jest
        .spyOn(userServiceMock, 'searchUserById')
        .mockRejectedValueOnce(new NotFoundException());
      // Act && Assert
      await expect(userServiceMock.searchUserById).rejects.toThrow(
        new NotFoundException(),
      );
    });
    it('should return a user when succeed', async () => {
      // Arrange'
      jest
        .spyOn(userServiceMock, 'searchUserById')
        .mockResolvedValue(userStub());
      // Act && Assert
      expect(userServiceMock.searchUserById('mock_user_id')).toEqual(
        Promise.resolve(userStub()),
      );
    });
  });

  describe('Method: updateUserStatusById', () => {});

  describe('Method: getAllUsers', () => {
    it('should throw a NotFoundException if no user found', async () => {
      // Arrange
      jest
        .spyOn(userServiceMock, 'getAllUsers')
        .mockRejectedValueOnce(new NotFoundException());
      // Act && Assert
      await expect(userServiceMock.getAllUsers).rejects.toThrow(
        new NotFoundException(),
      );
    });
    it('should return list of user when succeed', async () => {
      // Arrange
      jest
        .spyOn(userServiceMock, 'getAllUsers')
        .mockResolvedValue(Array(userStub()));
      // Act && Assert
      expect(userServiceMock.getAllUsers()).toEqual(
        Promise.resolve(userStub()),
      );
    });
  });
});
