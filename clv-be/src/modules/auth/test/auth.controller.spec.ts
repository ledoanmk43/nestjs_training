import { AuthController } from '@auth/controllers/auth.controller';
import { AuthService } from '@auth/services/auth.service';
import { JwtStrategy } from '@jwt/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { loginStub, registerStub } from './stubs/auth.stub';

jest.mock('@auth/services/auth.service.ts');
jest.mock('@jwt/jwt.strategy.ts');
jest.mock('@nestjs/jwt');
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let jwtStrategy: JwtStrategy;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy, JwtService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy);
    jwtService = moduleRef.get<JwtService>(JwtService);
    authController = moduleRef.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtStrategy).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(authController).toBeDefined();
  });

  describe('API: registerUser', () => {
    describe('When AuthService.registerUser is called', () => {
      beforeEach(async () => {
        await authController.register(registerStub());
      });

      it('should call authService.registerUser with the provided register data', () => {
        expect(authService.registerUser).toHaveBeenCalledWith(registerStub());
      });
    });
  });

  describe('API: loginUser', () => {
    describe('When AuthService.loginUser is called', () => {
      beforeEach(async () => {
        await authController.login(loginStub());
      });

      it('should call authService.loginUser with the provided register data', () => {
        expect(authService.loginUser).toHaveBeenCalledWith(loginStub());
      });
    });
  });
});
