// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AxiosResponse } from 'axios';

const unlockAccess = async (username: string): Promise<AxiosResponse> => {
  const { data } = await axios.patch(
    '/accounts/unlock',
    {
      user: {
        username,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );

  return data;
};

export default unlockAccess;
