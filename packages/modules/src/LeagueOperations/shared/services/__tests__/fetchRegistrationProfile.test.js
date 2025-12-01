import { axios } from '@kitman/common/src/utils/services';
import { response } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registration_profile';

import fetchRegistrationProfile from '../fetchRegistrationProfile';

describe('fetchRegistrationProfile', () => {
  let fetchRegistrationProfileRequest;
  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchRegistrationProfileRequest = jest
        .spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({ data: response.data }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with the correct params', async () => {
      const returnedData = await fetchRegistrationProfile({ id: 1 });

      expect(returnedData).toEqual(response.data);

      expect(fetchRegistrationProfileRequest).toHaveBeenCalledTimes(1);
      expect(fetchRegistrationProfileRequest).toHaveBeenCalledWith(
        '/registration/users/1',
        {
          headers: { Accept: 'application/json' },
        }
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchRegistrationProfileRequest = jest
        .spyOn(axios, 'get')
        .mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(fetchRegistrationProfile({ id: 1 })).rejects.toThrow();
    });
  });
});
