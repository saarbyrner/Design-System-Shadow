import { axios } from '@kitman/common/src/utils/services';
import getAthletePlayTimes from '../getAthletePlayTimes';

describe('getAthletePlayTimes', () => {
  const expectedResult = [
    {
      game_period_id: 1,
      athlete_id: 22,
      minutes: 30,
    },
    {
      game_period_id: 2,
      athlete_id: 30,
      minutes: 45,
      position_id: 5,
    },
  ];

  describe('success', () => {
    beforeEach(() =>
      jest.spyOn(axios, 'get').mockResolvedValue({ data: expectedResult })
    );

    afterEach(() => jest.restoreAllMocks());

    it('makes a backend call with the correct url and returns the expected result', async () => {
      const result = await getAthletePlayTimes(45);

      expect(axios.get).toHaveBeenCalledWith(
        '/ui/planning_hub/events/45/athlete_play_times'
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('failure', () => {
    beforeEach(() => {
      jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(getAthletePlayTimes(45)).rejects.toThrow();
    });
  });
});
