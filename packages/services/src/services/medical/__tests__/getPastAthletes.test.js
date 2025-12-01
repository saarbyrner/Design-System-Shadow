import { axios } from '@kitman/common/src/utils/services';
import { data as response } from '@kitman/services/src/mocks/handlers/medical/getPastAthletes';
import getPastAthletes from '@kitman/services/src/services/medical/getPastAthletes';

describe('getPastAthletes', () => {
  let request;

  it('returns the correct value', async () => {
    const returnedData = await getPastAthletes({
      filters: { athlete_name: 'search string' },
      page: 1,
    });
    expect(returnedData).toEqual(response);
  });

  describe('Mock axios', () => {
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getPastAthletes({
        filters: { athlete_name: 'search string' },
        page: 2,
      });

      expect(returnedData).toEqual(response);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/medical/rosters/past_athletes',
        {
          filters: {
            athlete_name: 'search string',
          },
          page: 2,
        },
        {
          headers: {
            Accept: 'application/json',
            'content-type': 'application/json',
          },
        }
      );
    });
  });
});
