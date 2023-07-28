import { AuthReq } from '@common/common.types';
import { JwtPayload } from '@src/modules/auth/jwt/jwt.payload';
import { ActivateDto, PermissionDto } from '@user/dto';
import { Permission, Role, User } from '@user/models';

const mockedId: string = '50b3fd95-930e-4ac5-8ca1-17b2780c1c7c';

export const userStub = (): User => {
  const user: User = new User();
  user.id = mockedId;
  user.roles = [roleStub()];
  user.email = 'mock@example.com';
  user.password = 'mockpassword';
  user.isPending = true;
  user.isDisable = true;
  user.firstName = 'John';
  user.lastName = 'Doe';
  user.globalId = 'mockglobalid';
  user.officeCode = 'mockofficecode';
  user.country = 'mockcountry';
  user.setCreateUpdateBy = jest.fn();
  user.setUpdateBy = jest.fn();
  user.hashPassword = jest.fn();
  return user;
};

export const roleStub = (): Role => {
  const role: Role = new Role();
  const permission: Permission = new Permission();
  permission.id = mockedId;
  role.id = mockedId;
  role.permissions = [permission];
  role.name = 'USER';

  return role;
};

export const permissionStub = (): Permission => {
  const permission: Permission = new Permission();
  const role: Role = new Role();
  role.id = mockedId;
  permission.id = mockedId;
  permission.description = 'test description';
  permission.name = 'USER';
  permission.roles = [role];
  return permission;
};

export const permissionDtoStub = (): PermissionDto => {
  const permission: PermissionDto = new PermissionDto();
  permission.rolesName = [mockedId];
  permission.description = 'test description';
  permission.name = 'USER';

  return permission;
};

export const authReqStub = (): AuthReq => {
  // Create a mock JwtPayload object
  const jwtPayload: JwtPayload = {
    id: mockedId,
    email: 'mock@example.com',
    role_id: [],
  };
  // Combine the Request and JwtPayload into the AuthReq object
  const authReq: AuthReq = Object.assign({ user: jwtPayload });
  return authReq;
};

export const activateStub = (): ActivateDto => {
  const dto: ActivateDto = Object.assign({ id: mockedId });
  return dto;
};
