import { axios } from '@kitman/common/src/utils/services';
import bulkUpdateAthletePlayTimes from '../bulkUpdateAthletePlayTimes';

describe('bulkUpdateAthletePlayTimes', () => {
  const playTimesToSave = [
    {
      game_period_id: 1,
      athlete_id: 12,
      minutes: 55,
    },
    {
      game_period_id: 2,
      athlete_id: 22,
      minutes: 45,
      position_id: 5,
    },
  ];

  describe('success', () => {
    beforeEach(() =>
      jest.spyOn(axios, 'post').mockResolvedValue({ data: playTimesToSave })
    );

    afterEach(() => jest.restoreAllMocks());

    it('makes a backend call to save the new/updated athlete play times', async () => {
      const result = await bulkUpdateAthletePlayTimes({
        eventId: 45,
        athletePlayTimes: playTimesToSave,
      });

      expect(axios.post).toHaveBeenCalledWith(
        '/ui/planning_hub/events/45/athlete_play_times/bulk_save',
        {
          athlete_play_times: playTimesToSave,
        }
      );
      expect(result).toEqual(playTimesToSave);
    });
  });

  describe('failure', () => {
    beforeEach(() => {
      jest.spyOn(axios, 'post').mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws an error', async () => {
      await expect(
        bulkUpdateAthletePlayTimes({
          eventId: 45,
          athletePlayTimes: playTimesToSave,
        })
      ).rejects.toThrow();
    });
  });
});
