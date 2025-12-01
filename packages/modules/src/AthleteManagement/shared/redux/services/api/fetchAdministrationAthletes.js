/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AdministrationAthleteData } from '@kitman/common/src/types/Athlete';

export type Filters = {
  active: boolean,
  search: string,
  page?: number,
  per_page?: number,
};

const fetchAdministrationAthletes = async ({
  active,
  search,
  page = 1,
  per_page = 30,
}: Filters): Promise<AdministrationAthleteData> => {
  const { data } = await axios.get('/administration/athletes', {
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      active,
      ...(search && { search }),
      page,
      per_page,
    },
  });
  return data;
};

export default fetchAdministrationAthletes;
