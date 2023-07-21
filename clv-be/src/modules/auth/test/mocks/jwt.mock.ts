import { MOCK_TOKEN } from './token.mock';

export const mockJwtService = {
  sign: jest.fn().mockReturnValue(MOCK_TOKEN),
};
