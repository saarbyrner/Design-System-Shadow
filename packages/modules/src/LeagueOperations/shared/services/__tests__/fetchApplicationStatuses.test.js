import { axios } from '@kitman/common/src/utils/services';
import fetchApplicationStatuses from '../fetchApplicationStatuses';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    post: jest.fn(),
  },
}));

describe('fetchApplicationStatuses', () => {
  const args = {
    userId: 123,
    registrationId: 456,
  };

  it('should return the correct application statuses when the request succeeds', async () => {
    const mockResponse = [{ id: 1, name: 'Approved', type: 'status' }];
    axios.post = jest.fn().mockResolvedValue({ data: mockResponse });

    const response = await fetchApplicationStatuses(args);

    expect(response).toEqual(mockResponse);
    expect(axios.post).toHaveBeenCalledWith(
      `/registration/users/${args.userId}/registrations/${args.registrationId}/available_statuses`
    );
  });

  it('should throw an error when the request fails', async () => {
    axios.post = jest.fn().mockRejectedValue(new Error('Request failed'));

    await expect(fetchApplicationStatuses(args)).rejects.toThrow('Request failed');
  });
});