// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { MatchMonitorReport } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/types';

const fetchMatchMonitorReport = async (
  eventId: number
): Promise<MatchMonitorReport> => {
  const { data } = await axios.get(
    `/planning_hub/events/${eventId}/game_monitor_reports`
  );

  return data;
};

export default fetchMatchMonitorReport;
