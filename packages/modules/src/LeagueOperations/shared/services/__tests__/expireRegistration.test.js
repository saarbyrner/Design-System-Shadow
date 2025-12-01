import { axios } from '@kitman/common/src/utils/services';
import expireRegistration from '../expireRegistration';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    post: jest.fn(),
  },
}));

describe('expireRegistration', () => {
  const args = {
    userId: 123,
    registrationId: 456,
  };

  it('should return the correct application statuses when the request succeeds', async () => {
    const mockResponse = [{ id: 1, name: 'Approved', type: 'status' }];
    axios.post = jest.fn().mockResolvedValue({ data: mockResponse });

    const response = await expireRegistration(args);

    expect(response).toEqual(mockResponse);
    expect(axios.post).toHaveBeenCalledWith(
      `/registration/users/${args.userId}/registrations/${args.registrationId}/expire`
    );
  });

  it('should throw an error when the request fails', async () => {
    axios.post = jest.fn().mockRejectedValue(new Error('Request failed'));

    await expect(expireRegistration(args)).rejects.toThrow('Request failed');
  });
});
