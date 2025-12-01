// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EventType } from '@kitman/modules/src/CalendarPage/src/types';

export type EventLocation = {
  id: number,
  name: string,
  parent_event_location_id: number,
  created_at: string,
  updated_at: string,
};

export type EventLocationFull = EventLocation & {
  parents: Array<EventLocationFull>,
};

export const eventLocationsRequestUrl = `/ui/planning_hub/event_locations`;

export const eventTypePermaIds = {
  session: { type: 'session_event', perma_id: 'session' },
  game: { type: 'game_event', perma_id: 'game' },
  custom: { type: 'custom_event', perma_id: 'custom' },
};

const getEventLocations = async ({
  eventType,
  searchValue,
  paginate = true,
  divisionId,
}: {
  eventType?: EventType,
  searchValue?: string,
  paginate?: boolean,
  divisionId?: number,
}): Promise<Array<EventLocationFull>> => {
  const params: {
    event_type_perma_id?: string,
    name?: string,
    page?: number,
    per_page?: number,
    division_id?: number,
    paginate?: boolean,
  } = {};

  if (searchValue !== undefined) {
    params.name = searchValue;
  }

  if (paginate === false) {
    params.paginate = false;
  } else {
    params.paginate = true;
    params.page = 1;
    params.per_page = 50;
  }

  if (divisionId !== undefined) {
    params.division_id = divisionId;
  }

  const eventLocationRequest = {
    params,
  };

  switch (eventType) {
    case eventTypePermaIds.session.type:
      eventLocationRequest.params.event_type_perma_id =
        eventTypePermaIds.session.perma_id;
      break;
    case eventTypePermaIds.game.type:
      eventLocationRequest.params.event_type_perma_id =
        eventTypePermaIds.game.perma_id;
      break;
    case eventTypePermaIds.custom.type:
      eventLocationRequest.params.event_type_perma_id =
        eventTypePermaIds.custom.perma_id;
      break;
    default:
      break;
  }

  const { data } = await axios.get(
    eventLocationsRequestUrl,
    eventLocationRequest
  );

  return data;
};

export default getEventLocations;
