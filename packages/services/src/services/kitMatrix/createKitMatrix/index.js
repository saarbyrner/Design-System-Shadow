// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  PlayerType,
  EquipmentName,
} from '@kitman/modules/src/KitMatrix/shared/types';

export type CreateKitMatrixPayload = {
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
    attachment: {
      url: string,
      name: string,
      type: string,
    },
  }>,
  division_id: number,
  league_season_id?: number,
};

const createKitMatrix = async (value: CreateKitMatrixPayload) => {
  const { data } = await axios.post('/planning_hub/kit_matrices', value, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  return data;
};

export default createKitMatrix;
