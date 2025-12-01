/* eslint-disable camelcase */
// @flow
import type { EventActivityDrillV2 } from '@kitman/common/src/types/Event';
import { axios } from '@kitman/common/src/utils/services';

export type EventActivityDrillsType = {
  event_activity_drills: Array<EventActivityDrillV2>,
  next_id: number | null,
};

export type EventActivityFilterParams = {
  event_activity_type_ids: Array<number>,
  principle_ids: Array<number>,
  search_expression: string,
  user_ids: Array<number>,
  squad_ids?: Array<number>,
  archived?: boolean,
  // If `only_favorites` is `true`, `exclude_favorites` must be `false`.
  // Responses for requests where `only_favorites` is `true` aren’t paginated,
  // all the data stored on the back end, however big it is, is returned at
  // once, in a single response. In all the other cases responses are paginated.
  only_favorites?: boolean,
  // If `exclude_favorites` is `true`, `only_favorites` must be `false`.
  exclude_favorites?: boolean,
  nextId?: ?number,
};

export const searchDrills = async ({
  event_activity_type_ids,
  principle_ids,
  search_expression,
  user_ids,
  squad_ids,
  only_favorites,
  exclude_favorites,
  archived,
  nextId,
}: EventActivityFilterParams): Promise<EventActivityDrillsType> => {
  const { data } = await axios.post(
    `/planning_hub/event_activity_drills/search`,
    {
      event_activity_type_ids,
      principle_ids,
      search_expression,
      user_ids,
      squad_ids,
      archived,
      only_favorites,
      exclude_favorites,
      next_id: nextId,
    }
  );
  return data;
};
