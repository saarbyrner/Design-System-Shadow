// @flow
import type { AthleteAvailabilities } from '@kitman/common/src/types/Event';
import { athleteAvailabilities } from '@kitman/common/src/types/Event';
import { colors } from '@kitman/common/src/variables';

const getAthleteAvailabilityStyles = (
  availability: AthleteAvailabilities
): {
  color: string,
  backgroundColor: string,
} =>
  ({
    [athleteAvailabilities.Absent]: {
      color: colors.red_100,
      backgroundColor: colors.red_100_20,
    },
    [athleteAvailabilities.Available]: {
      color: colors.green_200,
      backgroundColor: colors.green_100_20,
    },
    [athleteAvailabilities.Injured]: {
      color: colors.orange_100,
      backgroundColor: colors.orange_100_20,
    },
    [athleteAvailabilities.Unavailable]: {
      color: colors.red_100,
      backgroundColor: colors.red_100_20,
    },
    [athleteAvailabilities.Returning]: {
      color: colors.yellow_100,
      backgroundColor: colors.yellow_100_20,
    },
    [athleteAvailabilities.Ill]: {
      color: colors.orange_100,
      backgroundColor: colors.orange_100_20,
    },
  }[availability]);

export default getAthleteAvailabilityStyles;
