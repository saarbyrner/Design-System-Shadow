// @flow
import { axios } from '@kitman/common/src/utils/services';

type OrgId = string | number;
export type RequestResponse = Array<{ id: OrgId, name: string }>;

export const getClubSquadsUrl = (orgId: OrgId) =>
  `/associations/organisations/${orgId}/squads`;

const getClubSquads = async (orgId: OrgId): Promise<RequestResponse> => {
  const { data } = await axios.get(getClubSquadsUrl(orgId), {
    headers: {
      Accept: 'application/json',
    },
  });
  return data;
};

export default getClubSquads;
