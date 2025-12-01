/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';

const assignKitMatrix = async (
  eventId: string | number,
  { kind, kit_matrix_id }: { kind: string, kit_matrix_id: number }
): Promise<Object> => {
  try {
    const { data } = await axios.post(
      `/planning_hub/events/${eventId}/game_kit_matrices`,
      {
        kind,
        kit_matrix_id,
      }
    );
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default assignKitMatrix;
