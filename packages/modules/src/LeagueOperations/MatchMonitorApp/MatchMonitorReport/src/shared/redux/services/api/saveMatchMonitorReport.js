// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { MatchMonitorReport } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/types';

const saveMatchMonitorReport = async (
  eventId: number,
  reportData: MatchMonitorReport
): Promise<MatchMonitorReport> => {
  const { data } = await axios.post(
    `/planning_hub/events/${eventId}/game_monitor_reports`,
    { ...reportData }
  );

  return data;
};

export default saveMatchMonitorReport;
