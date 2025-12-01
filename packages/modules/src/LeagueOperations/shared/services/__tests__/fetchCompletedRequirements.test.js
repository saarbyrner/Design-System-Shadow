import { axios } from '@kitman/common/src/utils/services';
import data from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_completed_requirements';

import fetchCompletedRequirements from '../fetchCompletedRequirements';

describe('fetchCompletedRequirements', () => {
  let fetchCompletedRequirementsRequest;
  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchCompletedRequirementsRequest = jest
        .spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({ data }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with the correct params', async () => {
      const returnedData = await fetchCompletedRequirements({
        user_id: 1,
        registration_id: 1,
      });

      expect(returnedData).toEqual(data);

      expect(fetchCompletedRequirementsRequest).toHaveBeenCalledTimes(1);
      expect(fetchCompletedRequirementsRequest).toHaveBeenCalledWith(
        '/registration/users/1/registrations/1'
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchCompletedRequirementsRequest = jest
        .spyOn(axios, 'get')
        .mockImplementation(() => {
          throw new Error();
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(fetchCompletedRequirements({ id: 1 })).rejects.toThrow();
    });
  });
});
