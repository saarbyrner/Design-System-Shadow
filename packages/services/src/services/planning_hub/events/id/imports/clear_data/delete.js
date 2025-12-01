// @flow
import { axios } from '@kitman/common/src/utils/services';

export const deleteEventImports = async (eventId: number): Promise<void> => {
  await axios.delete(`/planning_hub/events/${eventId}/imports/clear_data`);
};
