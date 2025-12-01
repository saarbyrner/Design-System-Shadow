// @flow
import { axios } from '@kitman/common/src/utils/services';

const deleteMatchMonitorReport = async (eventId: number) => {
  await axios.delete(`/planning_hub/events/${eventId}/game_monitor_reports`);
};

export default deleteMatchMonitorReport;
