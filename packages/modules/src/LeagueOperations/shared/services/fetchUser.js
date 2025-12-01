// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { User } from '@kitman/modules/src/LeagueOperations/shared/types/common';

const fetchUser = async (id: string | number): Promise<User> => {
  const { data } = await axios.get(`/registration/users/${id}`);
  return data;
};

export default fetchUser;
