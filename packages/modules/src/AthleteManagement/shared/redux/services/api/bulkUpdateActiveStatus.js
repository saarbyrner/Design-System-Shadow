// @flow
import { axios } from '@kitman/common/src/utils/services';

export const BULK_UPDATE_ACTIVE_STATUS_ENDPOINT =
  '/users/bulk_update_active_status';

export type BulkUpdateActiveStatusRequestBody = {
  athlete_ids: Array<number>,
  is_active: boolean,
};

export type BulkUpdateActiveStatusReturnType = {};

export const bulkUpdateActiveStatus = async (
  requestBody: BulkUpdateActiveStatusRequestBody
): Promise<BulkUpdateActiveStatusReturnType> => {
  const { data } = await axios.patch(
    BULK_UPDATE_ACTIVE_STATUS_ENDPOINT,
    requestBody
  );

  return data;
};
