import { roleStub } from '@user/test/stubs/user.stub';

export const RoleService = jest.fn().mockImplementation(() => ({
  addRole: jest.fn().mockResolvedValue(roleStub()),
  searchRoleByCondition: jest.fn().mockResolvedValue(roleStub()),
}));
