import { axios } from '@kitman/common/src/utils/services';
import updateKitMatrix from '..';
import mockData from '../mock';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    patch: jest.fn(),
  },
}));

describe('updateKitMatrix', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls the correct endpoint and returns the server response', async () => {
    const mockResponse = { data: { foo: 'bar' } };
    axios.patch.mockResolvedValueOnce(mockResponse);

    const response = await updateKitMatrix({ id: 12, updates: mockData });

    expect(axios.patch).toHaveBeenCalledTimes(1);
    expect(axios.patch).toHaveBeenCalledWith(
      '/planning_hub/kit_matrices/12',
      mockData
    );
    expect(response).toEqual(mockResponse.data);
  });

  it('throws when axios fails', async () => {
    const error = new Error('Request failed');
    axios.patch.mockRejectedValueOnce(error);

    await expect(
      updateKitMatrix({ id: 12, updates: mockData })
    ).rejects.toThrow(error);
    expect(axios.patch).toHaveBeenCalledWith(
      '/planning_hub/kit_matrices/12',
      mockData
    );
  });
});
