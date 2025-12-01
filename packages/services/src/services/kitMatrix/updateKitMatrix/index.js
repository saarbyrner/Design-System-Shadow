// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  PlayerType,
  EquipmentName,
} from '@kitman/modules/src/KitMatrix/shared/types';
import type { KitMatrix } from '@kitman/services/src/services/kitMatrix/searchKitMatrices';

export type KitMatrixUpdates = {
  kind: PlayerType,
  organisation_id?: number,
  active?: boolean, // not supported yet
  squad_ids: Array<number>,
  name: string,
  primary_color: string,
  secondary_color?: string,
  kit_matrix_items: Array<{
    kind: EquipmentName,
    kit_matrix_color_id: number,
    attachment: ?{
      url: string,
      name: string,
      type: string,
    },
  }>,
  archived: boolean,
  division_id: number,
  league_season_id?: number,
};

export type UpdateKitMatrixPayload = {
  id: number,
  updates: $Shape<KitMatrixUpdates>,
};

const updateKitMatrix = async ({
  id,
  updates,
}: UpdateKitMatrixPayload): Promise<KitMatrix> => {
  const { data } = await axios.patch(
    `/planning_hub/kit_matrices/${id}`,
    updates
  );
  return data;
};

export default updateKitMatrix;
