import { permissionDtoStub, roleStub } from '@user/test/stubs/user.stub';

export const PermissionService = jest.fn().mockImplementation(() => ({
  addPermission: jest.fn().mockResolvedValue(permissionDtoStub()),
}));
