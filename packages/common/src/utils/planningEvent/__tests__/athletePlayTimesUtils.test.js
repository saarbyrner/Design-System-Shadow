import {
  getManualAthletePlayTimeForPeriod,
  handleAthletePlayTimeDeletion,
  updateAthletePlayTimeMinutes,
} from '../athletePlayTimesUtils';

describe('athletePlayTimes utils', () => {
  describe('getManualAthletePlayTimeForPeriod', () => {
    const athletePlayTimes = [
      { game_period_id: 1, minutes: 20, athlete_id: 2 },
      { game_period_id: 1, minutes: 35, athlete_id: 1 },
      { game_period_id: 2, minutes: 20, athlete_id: 2 },
    ];

    it('returns the appropriate athlete play time', () => {
      expect(getManualAthletePlayTimeForPeriod(2, athletePlayTimes, 1)).toEqual(
        athletePlayTimes[0]
      );
      expect(getManualAthletePlayTimeForPeriod(2, athletePlayTimes, 2)).toEqual(
        athletePlayTimes[2]
      );
    });
  });

  describe('handleAthletePlayTimeDeletion', () => {
    const athletePlayTimes = [
      { id: 20, game_period_id: 1, athlete_id: 2222, minutes: 30 },
      { game_period_id: 1, athlete_id: 2222, minutes: 30 },
    ];
    it('marks a saved athlete play time for deletion', () => {
      expect(handleAthletePlayTimeDeletion(athletePlayTimes, 0)).toEqual([
        { ...athletePlayTimes[0], delete: true, minutes: 0 },
        athletePlayTimes[1],
      ]);
    });

    it('removes a local athlete play time', () => {
      expect(handleAthletePlayTimeDeletion(athletePlayTimes, 1)).toEqual([
        athletePlayTimes[0],
      ]);
    });
  });

  describe('updateAthletePlayTimeMinutes', () => {
    const athletePlayTimes = [
      {
        id: 24,
        game_period_id: 1,
        athlete_id: 24444,
        minutes: 25,
        position_id: 20,
      },
      { id: 20, game_period_id: 1, athlete_id: 2222, minutes: 30 },
      { game_period_id: 1, athlete_id: 33333, minutes: 30 },
    ];

    const currentPeriod = { id: 1 };

    it('allows the user to update the existing athletes play time', () => {
      expect(
        updateAthletePlayTimeMinutes({
          athletePlayTimes,
          currentPeriod,
          athleteId: 24444,
          manualTime: 45,
        })
      ).toEqual([
        { ...athletePlayTimes[0], minutes: 45 },
        athletePlayTimes[1],
        athletePlayTimes[2],
      ]);
    });

    it('allows the user to add a new local athlete play time (sub)', () => {
      expect(
        updateAthletePlayTimeMinutes({
          athletePlayTimes,
          currentPeriod,
          athleteId: 1002,
          manualTime: 35,
        })
      ).toEqual([
        ...athletePlayTimes,
        { minutes: 35, athlete_id: 1002, game_period_id: 1 },
      ]);
    });

    it('allows the user to delete a athlete play time (sub)', () => {
      expect(
        updateAthletePlayTimeMinutes({
          athletePlayTimes,
          currentPeriod,
          athleteId: 33333,
          manualTime: 0,
        })
      ).toEqual([athletePlayTimes[0], athletePlayTimes[1]]);
    });
  });
});
