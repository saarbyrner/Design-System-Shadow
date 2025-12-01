// @flow
import { axios } from '@kitman/common/src/utils/services';

const resetMatchReport = async (eventId: number) => {
  await axios.post(`/planning_hub/events/${eventId}/reset_report`);
};

export default resetMatchReport;
