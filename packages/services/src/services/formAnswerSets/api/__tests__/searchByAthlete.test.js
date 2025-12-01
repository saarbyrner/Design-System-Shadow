import { axios } from '@kitman/common/src/utils/services';
import { data } from '../mocks/data/searchByAthlete';
import searchFormAnswerSetsByAthlete, {
  SEARCH_BY_ATHLETE_URL,
} from '../searchByAthlete';

describe('searchFormAnswerSetsByAthlete', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const params = {
      page: 1,
      per_page: 10,
      athleteIds: [42],
    };
    const returnedData = await searchFormAnswerSetsByAthlete(params);
    expect(returnedData).toEqual(data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct params', async () => {
      const params = {
        page: 1,
        per_page: 10,
        athleteIds: [42],
        statuses: ['completed', 'in_progress', 'not_started'],
      };
      await searchFormAnswerSetsByAthlete(params);
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(SEARCH_BY_ATHLETE_URL, {
        statuses: params.statuses,
        athlete_ids: params.athleteIds,
        pagination: { page: params.page, per_page: params.per_page },
        isInCamelCase: true,
      });
    });
  });
});
