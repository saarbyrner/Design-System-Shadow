import { axios } from '@kitman/common/src/utils/services';
import { data as mockResponseData } from '@kitman/services/src/mocks/handlers/medical/getAthleteRoster';
import getAthleteRoster, { GET_ATHLETE_ROSTER_URL } from '../getAthleteRoster';

describe('getAthleteRoster', () => {
  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getAthleteRoster(null, {});
      expect(returnedData).toEqual(mockResponseData);
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await getAthleteRoster(null, {});
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(GET_ATHLETE_ROSTER_URL, {
        filters: {},
        next_id: null,
      });
    });

    it('calls the correct endpoint with filters applied', async () => {
      await getAthleteRoster(null, { athlete_name: 'cooooookie' });
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(GET_ATHLETE_ROSTER_URL, {
        filters: { athlete_name: 'cooooookie' },
        next_id: null,
      });
    });
  });
});
