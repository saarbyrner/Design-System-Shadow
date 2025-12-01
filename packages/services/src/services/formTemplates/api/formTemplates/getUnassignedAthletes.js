// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { AthleteBasic } from '@kitman/common/src/types/Athlete';

export type RequestResponse = {
  data: Array<AthleteBasic>,
};

const getUnassignedAthletes = async ({
  searchQuery,
  pagination,
}: {
  searchQuery?: string,
  pagination?: { per_page?: number, page?: number },
}): Promise<RequestResponse> => {
  const params = {
    search_expression: searchQuery,
    per_page: pagination?.per_page ?? 25,
    page: pagination?.page ?? 1,
  };

  const { data } = await axios.get('/ui/unassigned_athletes', {
    params,
  });

  return data;
};

export default getUnassignedAthletes;
