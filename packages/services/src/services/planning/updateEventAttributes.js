// @flow
import { axios } from '@kitman/common/src/utils/services';
import { type GetAthleteEventsFilters } from '@kitman/services/src/services/planning';

export type AthleteParticipationDetails = {
  id: number,
  participation_level: ?number,
  participation_level_reason?: {
    id: number,
    name: string,
    label: string,
  },
  include_in_group_calculations?: boolean,
  rpe?: number,
  duration?: number,
};

export type Params = {
  eventId: number,
  attributes: {
    related_issue_id?: ?number,
    related_issue_type?: ?string,
    participation_level?: ?number | ?string,
    participation_level_reason?: ?number,
    include_in_group_calculations?: ?boolean,
  },
  // should not send athleteId & athletes together
  athleteId?: ?number, // single athlete update
  athletes?: Array<AthleteParticipationDetails>, // bulk athlete update
  filters?: GetAthleteEventsFilters,
  tab?: 'collections_tab' | 'athletes_tab',
  disableGrid?: boolean,
};

const updateEventAttributes = async ({
  eventId,
  attributes,
  athleteId = null,
  athletes,
  filters = {},
  tab,
  disableGrid,
}: Params): Promise<typeof undefined> => {
  await axios.post(
    `/planning_hub/events/${eventId}/athlete_events/update_attributes`,
    {
      ...attributes,
      athlete_id: athleteId,
      filters: {
        athlete_name: filters?.athleteName,
        positions: filters?.positions,
        squads: filters?.squads,
        availabilities: filters?.availabilities,
        participation_levels: filters?.participationLevels,
      },
      athletes,
      tab,
      disable_grid: disableGrid,
    }
  );
};
export default updateEventAttributes;
