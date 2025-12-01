import { axios } from '@kitman/common/src/utils/services';
import { response } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_registration_requirement';

import fetchRegistrationRequirements from '../fetchRegistrationRequirements';

describe('fetchRegistrationRequirements', () => {
  let fetchRegistrationRequirementsRequest;

  const args = {
    user_id: 1,
    requirement_id: 1,
  };

  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchRegistrationRequirementsRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.resolve(response));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('fetches the requirements', async () => {
      const returnedData = await fetchRegistrationRequirements(args);

      expect(returnedData).toEqual(response.data);

      expect(fetchRegistrationRequirementsRequest).toHaveBeenCalledTimes(1);
      expect(fetchRegistrationRequirementsRequest).toHaveBeenCalledWith(
        `/registration/requirements/${args.requirement_id}/form`,
        { user_id: args.user_id }
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchRegistrationRequirementsRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(fetchRegistrationRequirements(args)).rejects.toThrow();
    });
  });
});
