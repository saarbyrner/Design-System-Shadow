// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EventActivityV2 } from '@kitman/common/src/types/Event';

export type GetEventActivitiesParams = {
  eventId: number,
  params?: {
    excludeAthletes?: boolean,
    excludeSquads?: boolean,
  },
};

const getEventActivities = async ({
  eventId,
  params,
}: GetEventActivitiesParams): Promise<Array<EventActivityV2>> => {
  const { data } = await axios.get(
    `/ui/planning_hub/events/${eventId}/event_activities`,
    {
      params: {
        exclude_athletes: params?.excludeAthletes,
        exclude_squads: params?.excludeSquads,
      },
    }
  );
  return data;
};

export default getEventActivities;
