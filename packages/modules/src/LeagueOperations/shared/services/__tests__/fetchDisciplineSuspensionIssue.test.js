import { axios } from '@kitman/common/src/utils/services';
import { DISCIPLINE_SUSPENSION_RESPONSE } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import fetchRegistrationProfile from '../fetchDisciplineSuspensionIssue';

describe('fetchDisciplineSuspensionIssue', () => {
  let fetchDisciplineSuspensionIssueRequest;
  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchDisciplineSuspensionIssueRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() =>
          Promise.resolve({ data: DISCIPLINE_SUSPENSION_RESPONSE.data })
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with the current suspension status', async () => {
      const returnedData = await fetchRegistrationProfile({
        userId: 1,
        suspensionStatus: 'current',
        page: 1,
      });

      expect(returnedData).toEqual(DISCIPLINE_SUSPENSION_RESPONSE.data);

      expect(fetchDisciplineSuspensionIssueRequest).toHaveBeenCalledTimes(1);
      expect(fetchDisciplineSuspensionIssueRequest).toHaveBeenCalledWith(
        '/discipline/search',
        {
          archived: false,
          current_only: true,
          past_only: false,
          user_id: 1,
          page: 1,
        }
      );
    });

    it('calls the correct endpoint with the past suspension status', async () => {
      const returnedData = await fetchRegistrationProfile({
        userId: 1,
        suspensionStatus: 'past',
        page: 1,
      });

      expect(returnedData).toEqual(DISCIPLINE_SUSPENSION_RESPONSE.data);

      expect(fetchDisciplineSuspensionIssueRequest).toHaveBeenCalledTimes(1);
      expect(fetchDisciplineSuspensionIssueRequest).toHaveBeenCalledWith(
        '/discipline/search',
        {
          archived: false,
          current_only: false,
          past_only: true,
          user_id: 1,
          page: 1,
        }
      );
    });
  });
});
