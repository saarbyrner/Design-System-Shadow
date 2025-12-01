// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EventsUser } from '@kitman/common/src/types/Event';

export type GetOfficialUsersResponse = Array<EventsUser>;

const getOfficialUsers = async ({
  divisionId,
}: {
  divisionId?: number | null,
}): Promise<GetOfficialUsersResponse> => {
  const params = divisionId ? { division_id: divisionId } : {};
  const { data } = await axios.get('/users/official_only', { params });
  return data;
};

export default getOfficialUsers;
