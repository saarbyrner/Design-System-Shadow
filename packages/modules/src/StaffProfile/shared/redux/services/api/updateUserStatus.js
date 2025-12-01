// @flow

import { axios } from '@kitman/common/src/utils/services';

export type UpdateUserStatusRequestBody = {
  is_active: boolean,
};

export type UpdateUserStatusReturnType = {
  success: boolean,
};

const updateUserStatus = async (
  userId: number,
  requestBody: UpdateUserStatusRequestBody
): Promise<UpdateUserStatusReturnType> => {
  try {
    const { data } = await axios.patch(`/users/${userId}`, requestBody, {
      headers: { Accept: 'application/json' },
    });

    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    throw err;
  }
};

export default updateUserStatus;
