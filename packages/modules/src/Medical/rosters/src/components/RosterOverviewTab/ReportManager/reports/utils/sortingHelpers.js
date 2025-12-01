// @flow
import type {
  AthleteDemographicData,
  AthleteEmergencyContactData,
} from '@kitman/services/src/services/exports/exportDemographicReport';
import type { CommonSortKeys } from '../types';

export const sortDemographicAthletes = (
  athletes: Array<AthleteDemographicData>,
  sortKeys: CommonSortKeys
): Array<AthleteDemographicData> => {
  const sortFunction = (athleteA, athleteB) => {
    const primarySort = athleteA[sortKeys.primary].localeCompare(
      athleteB[sortKeys.primary]
    );
    if (sortKeys.secondary) {
      return (
        primarySort ||
        athleteA[sortKeys.secondary].localeCompare(athleteB[sortKeys.secondary])
      );
    }
    return primarySort;
  };

  return athletes.sort(sortFunction);
};

export const sortEmergencyContactAthletes = (
  athletes: Array<AthleteEmergencyContactData>,
  sortKeys: CommonSortKeys
): Array<AthleteEmergencyContactData> => {
  const sortFunction = (athleteA, athleteB) => {
    const primarySort = athleteA[sortKeys.primary].localeCompare(
      athleteB[sortKeys.primary]
    );
    if (sortKeys.secondary) {
      return (
        primarySort ||
        athleteA[sortKeys.secondary].localeCompare(athleteB[sortKeys.secondary])
      );
    }
    return primarySort;
  };

  return athletes.sort(sortFunction);
};
