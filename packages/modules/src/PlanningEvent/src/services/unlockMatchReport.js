// @flow
import { axios } from '@kitman/common/src/utils/services';

const unlockMatchReport = (eventId: number) => {
  return axios.post(`/planning_hub/events/${eventId}/unlock_report`);
};

export default unlockMatchReport;
