// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Coordinate } from '@kitman/common/src/types/PitchView';

type Args = {
  fieldId: number,
  formationId: number,
};

const getFormationPositionsCoordinates = async ({
  fieldId,
  formationId,
}: Args): Promise<Coordinate[]> => {
  const { data } = await axios.get(
    `/ui/planning_hub/formation_position_views?field_id=${fieldId}&formation_id=${formationId}`
  );

  return data;
};

export default getFormationPositionsCoordinates;
