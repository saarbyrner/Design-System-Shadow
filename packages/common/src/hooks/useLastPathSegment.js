// @flow

import useLocationPathname from './useLocationPathname';

/*
 * giving the url /league-schedule/match-reports/123
 * the returned value is 123
 */
const useLastPathSegment = () => {
  const [eventId] = useLocationPathname().split('/').slice(-1);
  return eventId;
};

export default useLastPathSegment;
