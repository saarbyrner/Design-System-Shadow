import { axios } from '@kitman/common/src/utils/services';
import response from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_search_discipline';

import searchDisciplineUserList from '../searchDisciplineUserList';

const MOCK_PARAMS = {
  search_expression: '',
  date_range: {
    start_date: '2025-11-05',
    end_date: '2025-11-06',
  },
};

describe('searchDisciplineUserList', () => {
  let searchDisciplineRequest;
  describe('when the request succeeds', () => {
    beforeEach(() => {
      searchDisciplineRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.resolve({ data: response }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with the correct params', async () => {
      const returnedData = await searchDisciplineUserList(MOCK_PARAMS);

      expect(returnedData).toEqual(response);

      expect(searchDisciplineRequest).toHaveBeenCalledTimes(1);
      expect(searchDisciplineRequest).toHaveBeenCalledWith(
        '/discipline/users/search',
        MOCK_PARAMS
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      searchDisciplineRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => {
          throw new Error();
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(searchDisciplineUserList(MOCK_PARAMS)).rejects.toThrow();
    });
  });
});
