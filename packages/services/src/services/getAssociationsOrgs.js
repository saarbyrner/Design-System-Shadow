// @flow
import { axios } from '@kitman/common/src/utils/services';

export type RequestResponse = Array<{ id: string | number, name: string }>;

const getAssociationsOrgs = async ({
  divisionIds,
}: {
  divisionIds?: number | null,
}): Promise<RequestResponse> => {
  const params = divisionIds ? { division_ids: [divisionIds] } : {};
  const { data } = await axios.post('/ui/associations/organisations', {
    skip_exclude_organisation_ids: true,
    ...params,
  });
  return data;
};

export default getAssociationsOrgs;
