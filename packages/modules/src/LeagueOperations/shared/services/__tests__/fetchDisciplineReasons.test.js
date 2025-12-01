import { axios } from '@kitman/common/src/utils/services';
import response from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_discipline_reasons';

import fetchDisciplineReasons from '../fetchDisciplineReasons';

describe('fetchDisciplineReasons', () => {
  let fetchDisciplineReasonsRequest;
  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchDisciplineReasonsRequest = jest
        .spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({ data: response }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with the correct params', async () => {
      const result = await fetchDisciplineReasons();

      expect(result).toEqual(response);

      expect(fetchDisciplineReasonsRequest).toHaveBeenCalledTimes(1);
      expect(fetchDisciplineReasonsRequest).toHaveBeenCalledWith(
        '/discipline/discipline_reasons'
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchDisciplineReasonsRequest = jest
        .spyOn(axios, 'get')
        .mockImplementation(() => {
          throw new Error();
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(fetchDisciplineReasons()).rejects.toThrow();
    });
  });
});
