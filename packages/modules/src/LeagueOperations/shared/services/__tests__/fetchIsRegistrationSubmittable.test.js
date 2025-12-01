import { axios } from '@kitman/common/src/utils/services';
import fetchIsRegistrationSubmittable from '../fetchIsRegistrationSubmittable';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    get: jest.fn(),
  },
}));

describe('fetchIsRegistrationSubmittable', () => {
  const args = {
    userId: 123,
    requirementId: 456,
  };

  it('should return the correct section statuses when the request succeeds', async () => {
    const mockResponse = [
      {
        active: true,
        id: 1,
        registration_completable: true,
        registration_complete: true,
        additional_info: null,
      },
    ];
    axios.get = jest.fn().mockResolvedValue({ data: mockResponse });

    const response = await fetchIsRegistrationSubmittable(args);

    expect(response).toEqual(mockResponse);
    expect(axios.get).toHaveBeenCalledWith(
      `/registration/requirements/${args.requirementId}?user_id=${args.userId}`
    );
  });

  it('should throw an error when the request fails', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Request failed'));

    await expect(fetchIsRegistrationSubmittable(args)).rejects.toThrow(
      'Request failed'
    );
  });
});
