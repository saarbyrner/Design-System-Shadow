import { axios } from '@kitman/common/src/utils/services';
import getInitialContext from '../getInitialContext';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    get: jest.fn(),
  },
}));

const mockResponse = {
  context: JSON.stringify({ identity: '6||123456', token: '123' }),
};

describe('getInitialContext', () => {
  it('should fetch initial context data', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mockResponse });

    const response = await getInitialContext();

    expect(axios.get).toHaveBeenCalledWith('/messaging/messaging_token');
    expect(response).toEqual(mockResponse);
  });
});
