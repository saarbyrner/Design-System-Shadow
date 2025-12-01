// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { PermissionDetails } from '@kitman/services/src/services/permissions/redux/services/types';

const fetchPermissionsDetails = async (
  staffId: number
): Promise<PermissionDetails> => {
  try {
    const { data } = await axios.get(
      `/administration/staff/${staffId}/permissions/edit`,
      {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default fetchPermissionsDetails;
