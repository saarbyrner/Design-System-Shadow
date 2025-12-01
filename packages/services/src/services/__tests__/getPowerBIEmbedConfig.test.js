import { axios } from '@kitman/common/src/utils/services';
import { data as mockResponse } from '@kitman/services/src/mocks/handlers/getPowerBiEmbedConfig';

import getPowerBiEmbedConfig from '../getPowerBiEmbedConfig';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    get: jest.fn(),
  },
}));

describe('getPowerBiEmbedConfig', () => {
  it('should return the correct section statuses when the request succeeds', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mockResponse });

    const response = await getPowerBiEmbedConfig(1);

    expect(response).toEqual(mockResponse);
    expect(axios.get).toHaveBeenCalledWith(`/pbi_reports/1`);
  });

  it('should throw an error when the request fails', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Request failed'));

    await expect(getPowerBiEmbedConfig(1)).rejects.toThrow('Request failed');
  });
});
