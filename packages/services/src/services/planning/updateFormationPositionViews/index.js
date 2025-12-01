// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Coordinate } from '@kitman/common/src/types/PitchView';

type Id = { id: ?number };

export type PositionViewUpdates = {
  formation_position_views: Array<
    Id & ({ x: number } | { y: number } | { position_id: number })
  >,
};

const updateFormationPositionViews = async (
  updates: PositionViewUpdates
): Promise<Array<Coordinate>> => {
  const { data } = await axios.post(
    `/ui/planning_hub/formation_position_views/bulk_save`,
    updates
  );
  return data;
};
export default updateFormationPositionViews;
