import { axios } from '@kitman/common/src/utils/services';
import response from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_search_discipline';

import createDisciplinaryIssue from '../createDisciplinaryIssue';

const MOCK_PARAMS = {
  kind: 'date_range',
  user_id: 1,
  reason_ids: [1, 2, 3],
  start_date: '2024',
  end_date: '2032',
};

describe('createDisciplinaryIssue', () => {
  let createDisciplinaryIssueRequest;
  describe('when the request succeeds', () => {
    beforeEach(() => {
      createDisciplinaryIssueRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => Promise.resolve({ data: response }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with the date range kind', async () => {
      await createDisciplinaryIssue(MOCK_PARAMS);

      expect(createDisciplinaryIssueRequest).toHaveBeenCalledTimes(1);
      expect(createDisciplinaryIssueRequest).toHaveBeenCalledWith(
        '/discipline/create',
        MOCK_PARAMS
      );
    });
    it('calls the correct endpoint with number of games params', async () => {
      await createDisciplinaryIssue({
        ...MOCK_PARAMS,
        kind: 'number_of_games',
        number_of_games: 2,
        end_date: null,
        squad_id: 1,
      });

      expect(createDisciplinaryIssueRequest).toHaveBeenCalledTimes(1);
      expect(createDisciplinaryIssueRequest).toHaveBeenCalledWith(
        '/discipline/create',
        {
          ...MOCK_PARAMS,
          kind: 'number_of_games',
          number_of_games: 2,
          end_date: null,
          squad_id: 1,
        }
      );
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      createDisciplinaryIssueRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() => {
          throw new Error();
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(createDisciplinaryIssue(MOCK_PARAMS)).rejects.toThrow();
    });
  });
});
