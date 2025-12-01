// @flow
import { axios } from '@kitman/common/src/utils/services';

import type {
  EventActivityGlobalStateResponse,
  EventActivityGlobalState,
} from '@kitman/modules/src/PlanningEvent/src/types/common';
import { mapEventActivityGlobalState } from '@kitman//modules/src/PlanningEvent/src/helpers/utils';

export type GetEventActivityGlobalStatesParams = {
  eventId: number,
  eventActivityIds: Array<number>,
};

export const getEventActivityGlobalStates = async ({
  eventId,
  eventActivityIds,
}: GetEventActivityGlobalStatesParams): Promise<
  Array<EventActivityGlobalState>
> => {
  const { data }: { data: Array<EventActivityGlobalStateResponse> } =
    await axios.post(
      `/ui/planning_hub/events/${eventId}/event_activity_athletes/states`,
      {
        event_activity_ids: eventActivityIds,
      }
    );
  if (!data) return [];
  return mapEventActivityGlobalState(data);
};
