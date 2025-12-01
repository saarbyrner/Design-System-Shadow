// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Meta, SearchAthleteProfile } from '../../../types';

export type RequestResponse = {
  data: Array<SearchAthleteProfile>,
  meta: Meta,
};

export type Filters = {
  is_active: boolean,
  search_expression: string,
  division_ids: ?Array<number>,
  organisation_ids: ?Array<number>,
  position_ids: ?Array<number>,
  career_status: ?Array<string>,
  squad_ids: ?Array<number>,
  label_ids: ?Array<number>,
  per_page: number,
  page: number,
  'include_athlete_game_status?': boolean,
};

const defaultFilters: Filters = {
  is_active: true,
  search_expression: '',
  division_ids: null,
  organisation_ids: null,
  position_ids: null,
  career_status: null,
  squad_ids: null,
  label_ids: null,
  per_page: 30,
  page: 1,
  'include_athlete_game_status?': false,
};

const searchAthletes = async (
  filters: $Shape<Filters> = defaultFilters
): Promise<RequestResponse> => {
  let response: RequestResponse;
  try {
    response = await axios.post('/settings/athletes/search', {
      ...defaultFilters,
      ...filters,
    });
  } catch (err) {
    throw new Error(err);
  }
  return response.data;
};

export default searchAthletes;
