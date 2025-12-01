// @flow
import { axios } from '@kitman/common/src/utils/services';

export type RequestResponse = Array<{ id: string | number, name: string }>;

const getClubs = async ({
  divisionIds,
}: {
  divisionIds?: number | null,
} = {}): Promise<RequestResponse> => {
  // NOTE: Backend prefers arrays for filters (e.g. [divisionIds]), but this endpoint
  // accepts single numbers in query strings.
  const params = divisionIds ? { division_ids: divisionIds } : {};
  const { data } = await axios.get('/ui/organisation/organisations/children', {
    headers: {
      Accept: 'application/json',
    },
    params,
  });
  return data;
};

export default getClubs;
