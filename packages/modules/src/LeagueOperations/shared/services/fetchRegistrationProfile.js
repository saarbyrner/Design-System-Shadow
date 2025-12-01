// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { User } from '@kitman/modules/src/LeagueOperations/shared/types/common';

type Params = {
  id: number | string,
};

const fetchRegistrationProfile = async ({ id }: Params): Promise<User> => {
  try {
    const { data } = await axios.get(`/registration/users/${id}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default fetchRegistrationProfile;
