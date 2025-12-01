import { axios } from '@kitman/common/src/utils/services';
import response from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registration_details_data';

import fetchRegistrationDetails from '../fetchRegistrationDetails';

describe('fetchRegistrationDetails', () => {
  let fetchRegistrationDetailsRequest;
  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchRegistrationDetailsRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.resolve({ data: response }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with the correct params', async () => {
      const returnedData = await fetchRegistrationDetails({
        id: 1,
      });

      expect(returnedData).toEqual(response);

      expect(fetchRegistrationDetailsRequest).toHaveBeenCalledTimes(1);
      expect(fetchRegistrationDetailsRequest).toHaveBeenCalledWith(
        '/registration/users/1/registrations/search'
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchRegistrationDetailsRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => {
          throw new Error();
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(fetchRegistrationDetails({ id: 1 })).rejects.toThrow();
    });
  });
});
