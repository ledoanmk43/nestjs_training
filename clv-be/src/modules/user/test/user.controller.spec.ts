import { AuthenticationGuard, AuthorizationGuard } from '@auth/guards';
import { createMock } from '@golevelup/ts-jest';
import { LoggerInterceptor, TransformInterceptor } from '@interceptors/index';
import {
  ArgumentsHost,
  CallHandler,
  ExecutionContext,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@user/controllers/user.controller';
import { User } from '@user/models';
import { PermissionService, RoleService, UserService } from '@user/services';
import { HttpExceptionFilter } from '@utils/exception.filter';
import { isGuarded } from '@utils/test/guard';
import { instanceToPlain } from 'class-transformer';
import { map } from 'rxjs';
import {
  activateStub,
  authReqStub,
  permissionDtoStub,
  roleStub,
  userStub,
} from './stubs/user.stub';

jest.mock('@user/services/user.service.ts');
jest.mock('@user/services/role.service.ts');
jest.mock('@user/services/permission.service.ts');
describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let roleService: RoleService;
  let permissionService: PermissionService;

  // Logger Interceptor
  let interceptor: any;
  let contextMock: any;
  let nextMock: any;

  // Exception filter
  let exceptionFilter: HttpExceptionFilter;
  let argumentsHost: ArgumentsHost;
  let response: Response;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [UserService, RoleService, PermissionService],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    roleService = moduleRef.get<RoleService>(RoleService);
    permissionService = moduleRef.get<PermissionService>(PermissionService);
    userController = moduleRef.get<UserController>(UserController);

    // interceptor
    interceptor = new LoggerInterceptor();
    exceptionFilter = new HttpExceptionFilter();
    contextMock = createMock<ExecutionContext>();
    nextMock = createMock<CallHandler>();

    // exception filter
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    argumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => response,
        getRequest: () => ({ url: '/test' }),
      }),
    } as any;
    exceptionFilter = new HttpExceptionFilter();

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
    expect(roleService).toBeDefined();
    expect(permissionService).toBeDefined();
  });

  describe('LoggerInterceptor', () => {
    it('should log the BEGIN and END messages', () => {
      const loggerLogSpy = jest.spyOn(Logger, 'log');
      const now = Date.now();

      interceptor.intercept(contextMock, nextMock).subscribe((data: any) => {
        expect(data).toEqual('response');

        expect(contextMock.switchToHttp).toHaveBeenCalled();
        expect(contextMock.getClass).toHaveBeenCalled();

        expect(loggerLogSpy).toHaveBeenCalledTimes(2);
        expect(loggerLogSpy).toHaveBeenCalledWith(
          `BEGIN [TestClass] GET /example`,
        );
        expect(loggerLogSpy).toHaveBeenCalledWith(
          `END [TestClass] GET /example ${Date.now() - now}ms`,
        );
      });

      expect(nextMock.handle).toHaveBeenCalled();
    });
  });

  describe('HttpExceptionFilter', () => {
    it('should handle HttpException and return the expected response', () => {
      const msg = 'User mock not found';
      const exception = new HttpException(msg, 404);

      exceptionFilter.catch(exception, argumentsHost);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: 404,
        path: '/test',
        message: msg,
      });
    });

    // Add more test cases for different scenarios if needed
  });

  // API GetUserById
  describe('API: getUserById', () => {
    describe('First Authentication Guard is called', () => {
      it('should be protected with Authorization', () => {
        expect(
          isGuarded(UserController.prototype.getUserById, AuthenticationGuard),
        );
      });
    });
    describe('Permission guard will not be call', () => {
      it('will be accept by any request after being authenticated', () => {
        expect(
          !isGuarded(UserController.prototype.getUserById, AuthorizationGuard),
        );
      });
    });
    describe('Then GetUserById is called', () => {
      let user: User;

      beforeEach(async () => {
        user = await userController.getUserById(authReqStub());
      });

      test('then it should call UserService.searchUserById', () => {
        expect(userService.searchUserById).toBeCalledWith(userStub().id);
      });

      test('then it should pass through TransformInterceptor', () => {
        const interceptor = new TransformInterceptor();
        const contextMock = createMock<ExecutionContext>();
        const nextMock = createMock<CallHandler>();
        nextMock.handle().pipe(
          map((data) =>
            instanceToPlain(data, {
              strategy: 'excludeAll',
            }),
          ),
        );
        interceptor.intercept(contextMock, nextMock).subscribe((result) => {
          expect(result).toEqual({ userStub });
        });
      });
    });
  });

  // others API
  describe('API: activateUserById', () => {
    describe('First Authentication Guard is called', () => {
      it('should be protected with Authorization', () => {
        expect(
          isGuarded(UserController.prototype.getUserById, AuthenticationGuard),
        );
      });
    });
    describe('Next Authorization Guard is called', () => {
      it('should be protected with Authorization', () => {
        expect(
          isGuarded(UserController.prototype.getUserById, AuthorizationGuard),
        );
      });
    });
    describe('Then activateUserById is called', () => {
      beforeEach(async () => {
        await userController.activateUserById(activateStub());
      });

      test('then it should call UserService', () => {
        expect(userService.updateUserStatusById).toBeCalledWith(activateStub());
      });
    });
  });

  describe('API: createPermission', () => {
    describe('When createPermission is called', () => {
      beforeEach(async () => {
        await userController.createPermission(permissionDtoStub());
      });

      it('should call PermissionService.addPermission', () => {
        expect(permissionService.addPermission).toHaveBeenCalledWith(
          permissionDtoStub(),
        );
      });

      it('should call RoleService.searchRoleByCondition', () => {
        expect(roleService.searchRoleByCondition).toHaveBeenCalledWith({
          where: { id: roleStub().id },
          relations: ['permissions'],
        });
      });

      // it('should call RoleService.addRole', () => {
      //   expect(roleService.addRole).toBeCalled();
      // });
    });
  });
});
