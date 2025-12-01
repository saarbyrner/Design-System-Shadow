// @flow
import { axios } from '@kitman/common/src/utils/services';

const deleteEvent = async (eventId: number, params: ?{}): Promise<void> => {
  await axios.delete(`/planning_hub/events/${eventId}`, {
    params,
  });
};

export default deleteEvent;
