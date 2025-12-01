// @flow
import { axios } from '@kitman/common/src/utils/services';
import { type Squad } from '@kitman/services/src/services/getSquads';

type ParentAssociation = {
  id: number,
  abbreviation: string,
  name: string,
  country: {
    abbreviation: string,
    id: number,
    name: string,
  },
};

export type CustomEventType = {
  id: number,
  name: string,
  created_at: string,
  updated_at: string,
  is_archived: boolean,
  is_selectable: boolean,
  parent_custom_event_type_id: number | null,
  parentLabel?: string,
  squads: Array<Squad>,
  parent_association: ParentAssociation | null,
  shared?: boolean,
};

export type CustomEventTypeFull = CustomEventType & {
  parents: Array<CustomEventType>,
};

export type CustomEventFilters = {
  archived?: boolean,
  selectable?: boolean,
  squadIds?: Array<number | string>,
};

export const getCustomEventTypesRoute = '/planning_hub/custom_event_types';

const getCustomEventTypes = async ({
  archived,
  selectable,
  squadIds,
}: CustomEventFilters): Promise<Array<CustomEventTypeFull>> => {
  const { data } = await axios.get(getCustomEventTypesRoute, {
    params: {
      is_archived: archived,
      is_selectable: selectable,
      squads: squadIds,
    },
  });

  return data;
};

export default getCustomEventTypes;
