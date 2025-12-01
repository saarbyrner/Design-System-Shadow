// @flow
import { axios } from '@kitman/common/src/utils/services';

import type {
  PlayerType,
  Athlete,
  Meta,
  RegistrationStatus,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';

export type RequestResponse = {
  data: Array<Athlete>,
  meta: Meta,
};

/**
 * When requesting an athlete list, by default, the BE will return the athletes for
 * the currently signed in organisation.
 * This becomes an issue when you are at an association level and viewing the
 * athlete list for an organisation as it will return association level data.
 *
 * To remedy this, addition of an optional filter param, organisation_id,
 * is passed from the calling component.
 *
 * The backend will attewmpt to return only athletes related to this organisation_id
 * if it is present.
 */
export type Filters = {
  search_expression: string,
  organisation_ids?: Array<number> | null,
  type?: PlayerType,
  registration_status: RegistrationStatus | '',
  registration_system_status_id?: number | null,
  squad_ids?: Array<number> | null,
  date_range?: { start_date: string | null, end_date: string | null } | null,
  label_ids?: Array<number> | null,
  per_page: number,
  page: number,
};

const searchAthleteList = async (
  filters: Filters = {
    search_expression: '',
    organisation_ids: null,
    registration_status: '',
    registration_system_status_id: null,
    squad_ids: null,
    per_page: 30,
    page: 0,
  }
): Promise<RequestResponse> => {
  const { data } = await axios.post('/registration/athletes/search', {
    ...filters,
  });

  return data;
};

export default searchAthleteList;
