import { axios } from '@kitman/common/src/utils/services';

import updateDisciplinaryIssue from '../updateDisciplinaryIssue';

const MOCK_PARAMS = {
  kind: 'date_range',
  id: 3,
  user_id: 1,
  reason_ids: [1, 2, 3],
  start_date: '2024',
  end_date: '2032',
};

describe('updateDisciplinaryIssue', () => {
  let updateDisciplinaryIssueRequest;
  describe('when the request succeeds', () => {
    beforeEach(() => {
      updateDisciplinaryIssueRequest = jest
        .spyOn(axios, 'put')
        .mockImplementation(() =>
          Promise.resolve({
            data: {
              message: 'Discipline updated',
            },
          })
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with the date range kind', async () => {
      await updateDisciplinaryIssue(MOCK_PARAMS);

      expect(updateDisciplinaryIssueRequest).toHaveBeenCalledTimes(1);
      expect(updateDisciplinaryIssueRequest).toHaveBeenCalledWith(
        '/discipline/update',
        MOCK_PARAMS
      );
    });

    it('calls the correct endpoint with the number of games kind', async () => {
      await updateDisciplinaryIssue({
        ...MOCK_PARAMS,
        kind: 'number_of_games',
        number_of_games: 2,
        end_date: null,
        squad_id: 1,
      });

      expect(updateDisciplinaryIssueRequest).toHaveBeenCalledTimes(1);
      expect(updateDisciplinaryIssueRequest).toHaveBeenCalledWith(
        '/discipline/update',
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
      updateDisciplinaryIssueRequest = jest
        .spyOn(axios, 'put')
        .mockImplementation(() => {
          throw new Error();
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(updateDisciplinaryIssue(MOCK_PARAMS)).rejects.toThrow();
    });
  });
});
