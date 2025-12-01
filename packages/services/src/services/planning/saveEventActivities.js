// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AthleteAvailabilities } from '@kitman/common/src/types/Event';
import type { EventActivityGlobalState } from '@kitman/modules/src/PlanningEvent/src/types/common';
import { mapEventActivityGlobalState } from '@kitman//modules/src/PlanningEvent/src/helpers/utils';

export type SaveEventActivitiesParams = {
  eventId: number,
  value: boolean,
  eventActivityIds: Array<number>,
  filters?: ?{
    athleteName?: string,
    positions?: Array<number>,
    squads?: Array<number>,
    availabilities?: Array<AthleteAvailabilities>,
    participationLevels?: Array<number>,
    athleteIds?: Array<number>,
  },
};

export const saveEventActivities = async ({
  eventId,
  value,
  eventActivityIds,
  filters,
}: SaveEventActivitiesParams): Promise<Array<EventActivityGlobalState>> => {
  const { data } = await axios.post(
    `/ui/planning_hub/events/${eventId}/event_activity_athletes/bulk_save`,
    {
      value,
      event_activity_ids: eventActivityIds,
      filters: {
        athlete_name: filters?.athleteName,
        positions: filters?.positions,
        squads: filters?.squads,
        availabilities: filters?.availabilities,
        participation_levels: filters?.participationLevels,
        athlete_ids: filters?.athleteIds,
      },
    }
  );
  if (!data) return [];
  return mapEventActivityGlobalState(data);
};
