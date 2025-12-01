import { colors } from '@kitman/common/src/variables';
import { athleteAvailabilities } from '@kitman/common/src/types/Event';
import getAthleteAvailabilityStyles from '../getAthleteAvailabilityStyles';

const tests = [
  [
    athleteAvailabilities.Available,
    {
      color: colors.green_200,
      backgroundColor: colors.green_100_20,
    },
  ],
  [
    athleteAvailabilities.Injured,
    {
      color: colors.orange_100,
      backgroundColor: colors.orange_100_20,
    },
  ],
  [
    athleteAvailabilities.Unavailable,
    {
      color: colors.red_100,
      backgroundColor: colors.red_100_20,
    },
  ],
  [
    athleteAvailabilities.Returning,
    {
      color: colors.yellow_100,
      backgroundColor: colors.yellow_100_20,
    },
  ],
  [
    athleteAvailabilities.Absent,
    {
      color: colors.red_100,
      backgroundColor: colors.red_100_20,
    },
  ],
  [
    athleteAvailabilities.Ill,
    {
      color: colors.orange_100,
      backgroundColor: colors.orange_100_20,
    },
  ],
];

describe('getAthleteAvailabilityStyles', () => {
  describe.each(tests)('when the argument is %s', (argument, expected) => {
    it('returns expected styles', () =>
      expect(getAthleteAvailabilityStyles(argument)).toEqual(expected));
  });
});
