// @flow
import moment from 'moment';
import omit from 'lodash/omit';
import cloneDeep from 'lodash/cloneDeep';
import type { MatchMonitorReport } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/types';

// Ensures there are no discrepancies in the report received from the backend
export const sanitizeReport = (report: MatchMonitorReport) => {
  if (!report) {
    return null;
  }
  const cloned = cloneDeep(report);
  delete cloned.updated_at;
  delete cloned.monitor_issue;
  if (Array.isArray(cloned.game_monitor_report_unregistered_athletes)) {
    cloned.game_monitor_report_unregistered_athletes =
      cloned.game_monitor_report_unregistered_athletes.map((athlete) => {
        return {
          ...omit(athlete, 'id'),
          date_of_birth: moment(athlete.date_of_birth).format('YYYY-MM-DD'),
        };
      });
  }
  return cloned;
};
