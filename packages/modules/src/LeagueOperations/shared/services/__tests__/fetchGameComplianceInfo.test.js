import { axios } from '@kitman/common/src/utils/services';
import { data as response } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/handlers/fetchGameComplianceInfo';

import fetchGameComplianceInfo from '../fetchGameComplianceInfo';

describe('fetchGameComplianceInfo', () => {
  let fetchGameComplianceInfoRequest;
  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchGameComplianceInfoRequest = jest
        .spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({ data: response }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with the correct params', async () => {
      const result = await fetchGameComplianceInfo(1235);

      expect(result).toEqual(response);

      expect(fetchGameComplianceInfoRequest).toHaveBeenCalledTimes(1);
      expect(fetchGameComplianceInfoRequest).toHaveBeenCalledWith(
        `/planning_hub/game_compliance/1235/rules`
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchGameComplianceInfoRequest = jest
        .spyOn(axios, 'get')
        .mockImplementation(() => {
          throw new Error();
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(fetchGameComplianceInfo(1245)).rejects.toThrow();
    });
  });
});
