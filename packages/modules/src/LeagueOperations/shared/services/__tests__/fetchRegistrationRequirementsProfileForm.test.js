import { axios } from '@kitman/common/src/utils/services';
import { response } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registration_profile';

import fetchRegistrationRequirementsProfileForm from '../fetchRegistrationRequirementsProfileForm';

describe('fetchRegistrationRequirementsProfileForm', () => {
  let fetchRegistrationProfileFormRequest;
  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchRegistrationProfileFormRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.resolve({ data: response.data }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with the correct params', async () => {
      const returnedData = await fetchRegistrationRequirementsProfileForm({
        user_id: 1,
        requirement_id: 1,
      });

      expect(returnedData).toEqual(response.data);

      expect(fetchRegistrationProfileFormRequest).toHaveBeenCalledTimes(1);
      expect(fetchRegistrationProfileFormRequest).toHaveBeenCalledWith(
        '/registration/users/1/profile',
        {
          requirement_id: 1,
        }
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchRegistrationProfileFormRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(
        fetchRegistrationRequirementsProfileForm({
          user_id: 1,
          requirement_id: 1,
        })
      ).rejects.toThrow();
    });
  });
});
