// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Squad, Meta } from '../types/common';

export type RequestResponse = {
  data: Array<Squad>,
  meta: Meta,
};

/**
 * When requesting a squad list, by default, the BE will return the squads for
 * the currently signed in organisation.
 * This becomes an issue when you are at an association level and viewing the
 * squad list for an organisation as it will return association level data.
 *
 * To remedy this, addition of an optional filter param, organisation_id,
 * is passed from the calling component.
 *
 * The backend will attewmpt to return only squads related to this organisation_id
 * if it is present.
 */

export type Filters = {
  search_expression: string,
  organisation_id?: number,
  squad_id?: number | null,
  per_page: number,
  page: number,
};

const searchSquadList = async (
  filters: Filters = {
    search_expression: '',
    per_page: 30,
    page: 0,
  }
): Promise<RequestResponse> => {
  const { data } = await axios.post('/registration/squads/search', {
    ...filters,
  });

  return data;
};

export default searchSquadList;
