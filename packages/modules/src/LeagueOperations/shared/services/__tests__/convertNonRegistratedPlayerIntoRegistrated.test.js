import { axios } from '@kitman/common/src/utils/services';
import convertNonRegistratedPlayerIntoRegistrated from '../convertNonRegistratedPlayerIntoRegistrated';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    post: jest.fn(),
  },
}));

describe('convertNonRegistratedPlayerIntoRegistrated', () => {
  const args = {
    athleteId: 123,
  };

  it('should return the correct application statuses when the request succeeds', async () => {
    const mockResponse = { data: {} };
    axios.post = jest.fn().mockResolvedValue({ data: mockResponse });

    const response = await convertNonRegistratedPlayerIntoRegistrated(args);
    expect(response).toEqual(mockResponse);
    expect(axios.post).toHaveBeenCalledWith(
      `/registration/athletes/${args.athleteId}/register_homegrown`
    );
  });

  it('should throw an error when the request fails', async () => {
    axios.post = jest.fn().mockRejectedValue(new Error('Request failed'));

    await expect(
      convertNonRegistratedPlayerIntoRegistrated(args)
    ).rejects.toThrow('Request failed');
  });
});
