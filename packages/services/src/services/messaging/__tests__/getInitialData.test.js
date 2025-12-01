import { axios } from '@kitman/common/src/utils/services';
import getInitialData from '../getInitialData';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    get: jest.fn(),
  },
}));

const mockResponse = {
  context: JSON.stringify({ token: '123' }),
};

describe('getInitialData', () => {
  it('should fetch initial data', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mockResponse });

    const response = await getInitialData();

    expect(axios.get).toHaveBeenCalledWith('/messaging/messaging_initial_data');
    expect(response).toEqual(mockResponse);
  });
});
