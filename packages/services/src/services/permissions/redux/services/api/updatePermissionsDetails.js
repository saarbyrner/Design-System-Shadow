// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  PermissionDetailsRequestBody,
  UpdatePermissionDetailsResponse,
} from '@kitman/services/src/services/permissions/redux/services/types';

const updatePermissionsDetails = async (
  staffId: number,
  requestBody: PermissionDetailsRequestBody
): Promise<UpdatePermissionDetailsResponse> => {
  try {
    const { data } = await axios.put(
      `/administration/staff/${staffId}/permissions`,
      requestBody
    );

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default updatePermissionsDetails;
