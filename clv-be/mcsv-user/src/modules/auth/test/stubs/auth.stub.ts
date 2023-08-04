import { AuthResponseDTO, LoginDTO, RegisterDTO } from '@auth/dto';

import { Role, User } from '@user/models';
import { MOCK_ACCESS_TOKEN } from '@auth/test/mocks/token.mock';
import { MOCK_ROLE_ID } from '@user/test/mocks/role.mock';
import { userStub } from '@user/test/stubs/user.stub';

export const registerStub = (): RegisterDTO => {
  const dto: RegisterDTO = new RegisterDTO();
  dto.role = new Role();
  dto.role.id = MOCK_ROLE_ID;
  dto.firstName = 'John';
  dto.lastName = 'Doe';

  return dto;
};

export const loginStub = (): LoginDTO => {
  const dto: LoginDTO = new LoginDTO();
  dto.email = 'mock@email.com';
  dto.password = 'A1231230@a';

  return dto;
};

export const authResponseStub = (): AuthResponseDTO => {
  const dto: AuthResponseDTO = new AuthResponseDTO();
  dto.accessToken = MOCK_ACCESS_TOKEN;
  return dto;
};
