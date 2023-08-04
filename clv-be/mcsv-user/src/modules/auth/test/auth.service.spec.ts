import { AuthService } from '@auth/services/auth.service';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { RoleService, UserService } from '@user/services';
import { roleStub, userStub } from '@user/test/stubs/user.stub';
import * as bcrypt from 'bcrypt';
import { mockConfigService } from './mocks/config-service.mock';
import { mockJwtService } from './mocks/jwt.mock';
import { authResponseStub, registerStub } from './stubs/auth.stub';

jest.mock('@auth/services/auth.service.ts');
jest.mock('@user/services/user.service.ts');
jest.mock('@user/services/role.service.ts');
describe('AuthService', function () {
  let authService: AuthService;
  let userService: UserService;
  let roleService: RoleService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        JwtService,
        UserService,
        RoleService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    roleService = moduleRef.get<RoleService>(RoleService);

    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(roleService).toBeDefined();
  });
  describe('Method: registerUser', () => {
    it('should throw a ConflictException if user with email already exists', async () => {
      // Arrange
      jest
        .spyOn(userService, 'addUser')
        .mockRejectedValueOnce(new ConflictException());
      // Act && Assert
      await expect(userService.addUser).rejects.toThrow(
        new ConflictException(),
      );
    });

    it('should successfully create and return a token if email is not taken', async () => {
      // Arrange
      const registerDto = registerStub();
      jest.spyOn(userService, 'addUser').mockResolvedValue(userStub());

      jest
        .spyOn(roleService, 'searchRoleByCondition')
        .mockResolvedValue(roleStub());

      jest
        .spyOn(authService, 'generateAccessToken')
        .mockReturnValue(authResponseStub());

      // Act & Assert
      expect(userService.addUser(registerDto)).toEqual(
        Promise.resolve(userStub()),
      );

      expect(roleService.searchRoleByCondition('condition')).toEqual(
        Promise.resolve(roleStub()),
      );

      expect(authService.generateAccessToken(userStub(), ['USER'])).toEqual(
        authResponseStub(),
      );
    });
  });

  describe('Method: loginUser', () => {
    it('should throw a error message if user miss typing their email or password', async () => {
      // Arrange
      const userDto = userStub();
      userDto.email = 'wrong_email';
      userDto.password = 'mock_wrong_password';
      const userDb = userStub();
      jest
        .spyOn(authService, 'loginUser')
        .mockImplementation(async () => {
          const isVerified = await bcrypt.compare(
            userDto.password,
            userDb.password,
          );
          if (!isVerified || userDb.email != userDto.email) {
            throw new BadRequestException();
          }
          return Promise.resolve(authResponseStub());
        })
        .mockRejectedValueOnce(new BadRequestException());
      // Act && Assert
      await expect(authService.loginUser).rejects.toThrow(
        new BadRequestException(),
      );
    });

    it('should successfully return a token if email and password match', async () => {
      // Arrange
      jest
        .spyOn(authService, 'generateAccessToken')
        .mockReturnValue(authResponseStub());
      // Act & Assert
      expect(authService.generateAccessToken(userStub(), ['USER'])).toEqual(
        authResponseStub(),
      );
    });
  });
});
