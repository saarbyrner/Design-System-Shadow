import { axios } from '@kitman/common/src/utils/services';
import fetchSectionStatuses from '../fetchSectionStatuses';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    post: jest.fn(),
  },
}));

describe('fetchSectionStatuses', () => {
  const args = {
    userId: 123,
    registrationId: 456,
    sectionId: 789,
  };

  it('should return the correct section statuses when the request succeeds', async () => {
    const mockResponse = [{ id: 1, name: 'Status 1', type: 'type1' }];
    axios.post = jest.fn().mockResolvedValue({ data: mockResponse });

    const response = await fetchSectionStatuses(args);

    expect(response).toEqual(mockResponse);
    expect(axios.post).toHaveBeenCalledWith(
      `/registration/registrations/${args.registrationId}/sections/${args.sectionId}/available_statuses`,
      {
        user_id: args.userId,
      }
    );
  });

  it('should throw an error when the request fails', async () => {
    axios.post = jest.fn().mockRejectedValue(new Error('Request failed'));

    await expect(fetchSectionStatuses(args)).rejects.toThrow('Request failed');
  });
});
