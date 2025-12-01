// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  AthleteAvailabilities,
  AthleteEventV2,
} from '@kitman/common/src/types/Event';

export type GetAthleteEventsFilters = {
  athleteName?: string,
  positions?: Array<number>,
  squads?: Array<number>,
  availabilities?: Array<AthleteAvailabilities>,
  participationLevels?: Array<number>,
};

export const getAthleteEventsSortingOptions = {
  Position: 'position',
  ParticipationLevel: 'participation_level',
  ParticipationLevelInverted: 'participation_level_inverted',
  PrimarySquad: 'primary_squad',
  AvailabilityStatus: 'availability_status',
};
export type GetAthleteEventsSortingOptions = $Values<
  typeof getAthleteEventsSortingOptions
>;

export type GetAthleteEventsParams = {
  eventId: number,
  nextId?: ?number,
  includeEventActivityIds?: boolean,
  filters?: GetAthleteEventsFilters,
  sortBy?: GetAthleteEventsSortingOptions,
};

export type GetAthleteEventsResponse = {
  athlete_events: Array<AthleteEventV2>,
  next_id: ?number,
};

export const getAthleteEvents = async ({
  eventId,
  nextId,
  includeEventActivityIds,
  filters,
  sortBy,
}: GetAthleteEventsParams): Promise<GetAthleteEventsResponse> => {
  const { data } = await axios.post(
    `/planning_hub/events/${eventId}/athlete_events/paginated`,
    {
      filters: {
        athlete_name: filters?.athleteName,
        positions: filters?.positions,
        squads: filters?.squads,
        availabilities: filters?.availabilities,
        participation_levels: filters?.participationLevels,
      },
      sort_by: sortBy,
      include_event_activity_ids: includeEventActivityIds,
      next_id: nextId,
    }
  );
  return data;
};
