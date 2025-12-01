// @flow

import useLeagueOperations from './useLeagueOperations';
import useLocationAssign from './useLocationAssign';
import { usePreferences } from '../contexts/PreferenceContext/preferenceContext';

export type RedirectToMatchReport = (eventId: number | string) => void;

const useRedirectToMatchReport = (): RedirectToMatchReport => {
  const locationAssign = useLocationAssign();
  const { isLeague, isOfficial, isOrgSupervised, isScout } =
    useLeagueOperations();
  const { preferences } = usePreferences();

  const redirectToMatchReport: RedirectToMatchReport = (eventId) => {
    let reportUrl = '';

    if (preferences?.match_monitor) {
      reportUrl = '/match_monitor/report';
    } else {
      if (isScout) {
        reportUrl = `/scout-schedule/reports`;
      }
      if (isOrgSupervised) {
        reportUrl = `/planning_hub/league-schedule/reports`;
      }
      if (isLeague || isOfficial) {
        reportUrl = `/league-fixtures/reports`;
      }
    }

    if (reportUrl) {
      locationAssign(`${reportUrl}/${eventId}`);
    }
  };

  return redirectToMatchReport;
};

export default useRedirectToMatchReport;
