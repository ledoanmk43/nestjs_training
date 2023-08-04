import { userStub } from '@user/test/stubs/user.stub';

export const UserService = jest.fn().mockImplementation(() => ({
  addUser: jest.fn().mockResolvedValue(userStub()),
  searchUserByCondition: jest.fn().mockResolvedValue(userStub()),
  searchUserById: jest.fn().mockResolvedValue(userStub().id),
  updateUserStatusById: jest.fn().mockResolvedValue([userStub()]),
  getAllUsers: jest.fn().mockResolvedValue(userStub()),
}));
