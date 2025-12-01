import { axios } from '@kitman/common/src/utils/services';
import { data as mockResponse } from '@kitman/services/src/mocks/handlers/getTrainingVariables';

import getTrainingVariables from '../getTrainingVariables';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    post: jest.fn(),
  },
}));

describe('getTrainingVariables', () => {
  const args = {
    platformId: 1,
  };

  it('should return the correct section statuses when the request succeeds', async () => {
    axios.post = jest.fn().mockResolvedValue({ data: mockResponse });

    const response = await getTrainingVariables(args);

    expect(response).toEqual(mockResponse);
    expect(axios.post).toHaveBeenCalledWith(`/training_variables/search`, {
      platform_id: args.platformId,
    });
  });

  it('should throw an error when the request fails', async () => {
    axios.post = jest.fn().mockRejectedValue(new Error('Request failed'));

    await expect(getTrainingVariables(args)).rejects.toThrow('Request failed');
  });
});
