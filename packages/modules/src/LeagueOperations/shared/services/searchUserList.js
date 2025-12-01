// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  RegistrationStatus,
  Meta,
  User,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';

export type RequestResponse = {
  data: Array<User>,
  meta: Meta,
};

/**
 * When requesting a user list, by default, the BE will return the users for
 * the currently signed in organisation.
 * This becomes an issue when you are at an association level and viewing the
 * user list for an organisation as it will return association level data.
 *
 * To remedy this, addition of an optional filter param, organisation_ids,
 * is passed from the calling component.
 *
 * The backend will attempt to return only users related to the organisation_ids
 * if they are present.
 */

export type Filters = {
  organisation_ids?: Array<number> | null,
  search_expression: string,
  squad_id?: number | null,
  registration_status?: RegistrationStatus | '',
  registration_system_status_id?: number | null,
  per_page: number,
  page: number,
};

const searchUserList = async (
  filters: Filters = {
    organisation_ids: null,
    search_expression: '',
    registration_status: null,
    registration_system_status_id: null,
    per_page: 30,
    page: 0,
  }
): Promise<RequestResponse> => {
  const { data } = await axios.post('/registration/users/search', {
    ...filters,
  });
  return data;
};

export default searchUserList;
