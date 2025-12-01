// @flow
import { axios } from '@kitman/common/src/utils/services';

type Params = {
  eventIds: number[],
};

export type EventDetails = {
  event_id: number,
  home_dmr_status: Array<string>,
  away_dmr_status: Array<string>,
};

const getEventsUpdates = async (
  params: Params
): Promise<Array<EventDetails>> => {
  const { data } = await axios.post(
    '/planning_hub/events/fetch_event_updates',
    {
      event_ids: params.eventIds,
    }
  );
  return data;
};

export default getEventsUpdates;
