import { authResponseStub } from '@auth/test/stubs/auth.stub';

export const AuthService = jest.fn().mockReturnValue({
  registerUser: jest.fn().mockResolvedValue(authResponseStub()),
  loginUser: jest.fn().mockResolvedValue(authResponseStub()),
  generateAccessToken: jest.fn().mockReturnValue(authResponseStub()),
});
