// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { KitMatrix } from '../searchKitMatrices';

export type GameKitMatrix = {
  kind: string,
  kit_matrix_id: number,
  kit_matrix: KitMatrix,
};

const getGameKitMatrices = async ({
  eventId,
}: {
  eventId: number,
}): Promise<Array<GameKitMatrix>> => {
  const { data } = await axios.get(
    `/planning_hub/events/${eventId}/game_kit_matrices`
  );
  return data;
};

export default getGameKitMatrices;
