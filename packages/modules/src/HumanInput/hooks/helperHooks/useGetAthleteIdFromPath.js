// @flow
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';

export const useGetAthleteIdFromPath = () => {
  /*
   * given the url /athletes/40211/profile
   * the athleteId is the 3rd part of the URL
   * example split: ['', 'athletes', '40211', 'profile']
   */
  const locationPathname = useLocationPathname();
  const athleteId = +locationPathname.split('/')[2];
  return athleteId;
};
