/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';

export type UpdateKitMatrixPayload = {
  kit_matrix_ids: Array<number>,
  archived: boolean,
};

const bulkUpdateKitMatrix = async ({
  kit_matrix_ids,
  archived,
}: UpdateKitMatrixPayload) => {
  const { data } = await axios.patch(`/planning_hub/kit_matrices/bulk_update`, {
    kit_matrix_ids,
    archived,
  });
  return data;
};

export default bulkUpdateKitMatrix;
