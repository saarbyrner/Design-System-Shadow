// @flow
import { axios } from '@kitman/common/src/utils/services';

export const deleteEventImport = async (
  eventId: number,
  sourceId: string
): Promise<void> => {
  await axios.delete(
    `/planning_hub/events/${eventId}/imports/clear_data_by_source`,
    {
      data: { source: sourceId },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
};
