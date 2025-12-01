import { axios } from '@kitman/common/src/utils/services';
import response from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_search_discipline';

import searchDisciplineAthleteList from '../searchDisciplineAthleteList';

const MOCK_PARAMS = {
  search_expression: '',
  date_range: {
    start_date: '2025-11-05',
    end_date: '2025-11-06',
  },
};

describe('searchDisciplineAthleteList', () => {
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
      const returnedData = await searchDisciplineAthleteList(MOCK_PARAMS);

      expect(returnedData).toEqual(response);

      expect(searchDisciplineRequest).toHaveBeenCalledTimes(1);
      expect(searchDisciplineRequest).toHaveBeenCalledWith(
        '/discipline/athletes/search',
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
      await expect(searchDisciplineAthleteList(MOCK_PARAMS)).rejects.toThrow();
    });
  });
});
